'use client'

import { Button, Text, Group, Stack, Select } from '@mantine/core';
import Link from 'next/link';
import classes from './Dashboard.module.css';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/user';
import { compareAsc, format, parseISO } from 'date-fns';

type userInterface = {
    user_id: string,
}

export type expenseInterface = {
    id: string,
    user_id: string,
    date: Date,
    coffee_expense: number,
    food_expense: number,
    alcohol_expense: number,
}

export const ExpenseDashboard = () => {
    const [users, setUsers] = useState<userInterface[] | undefined>(undefined);
    const { user, setUser } = useUserContext();
    const [newCoffeeExpense, setNewCoffeeExpense] = useState<number>(0);
    const [coffeeWOW, setCoffeeWOW] = useState<number>(0);
    const [newFoodExpense, setNewFoodExpense] = useState<number>(0);
    const [foodWOW, setFoodWOW] = useState<number>(0);
    const [newAlcoholExpense, setNewAlcoholExpense] = useState<number>(0);
    const [alcoholWOW, setAlcoholWOW] = useState<number>(0);
    const [haveRecord, setHaveRecord] = useState<boolean>(false);

    const getUsers = async () => {
        const response = await fetch('api/users');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const userIds = data.map((user: userInterface) => (user.user_id).toString());
        setUsers(userIds);
    }

    //the data structure of users from databse is diff from the form select
    const transformedUsers = users?.map(user => ({
        label: user,
        value: user,
    }))

    const getExpenses = async () => {
        const response = await fetch('api/expenses');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        //new and previous expense of the current user 
        const currentUserExpenses = data.filter((expense: expenseInterface) => Number(expense.user_id) === Number(user?.value));
        const sortedCurrentUserExpenses = currentUserExpenses.sort((a: expenseInterface, b: expenseInterface) => compareAsc(new Date(a.date), new Date(b.date)));
        const newExpenses = sortedCurrentUserExpenses.slice(-7);
        const prevExpenses = sortedCurrentUserExpenses.slice(Math.max(0, sortedCurrentUserExpenses.length - 8 - 7), sortedCurrentUserExpenses.length - 8 + 1);

        //calculate the expense week on week
        const calculateWOw = (
            newExpenses: expenseInterface[],
            prevExpenses: expenseInterface[],
            setNewExpense: (value: number) => void,
            setExpenseWOW: (value: number) => void,
            expenseType: 'coffee_expense' | 'food_expense' | 'alcohol_expense',
        ) => {
            const _newExpense = newExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur[expenseType]), 0);
            setNewExpense(_newExpense);
            const prevExpense = prevExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur[expenseType]), 0);
            const expenseWoW = (_newExpense / 7 - (prevExpense / prevExpenses.length)) / (_newExpense / 7);
            setExpenseWOW(expenseWoW);
        }
        calculateWOw(newExpenses, prevExpenses, setNewCoffeeExpense, setCoffeeWOW, 'coffee_expense');
        calculateWOw(newExpenses, prevExpenses, setNewFoodExpense, setFoodWOW, 'food_expense');
        calculateWOw(newExpenses, prevExpenses, setNewAlcoholExpense, setAlcoholWOW, 'alcohol_expense');

        //if there is record of today
        const today = format(new Date(), 'yyyy-MM-dd');
        const _haveRecord = currentUserExpenses.find(
            (expense: expenseInterface) => format(parseISO(expense.date.toLocaleString()), 'yyyy-MM-dd') === today);
        if (_haveRecord) {
            setHaveRecord(true);
        } else {
            setHaveRecord(false);
        }
    }

    useEffect(() => {
        getUsers();
        getExpenses();
    }, [user])

    return (
        <Group
            miw={'100%'}
            mih={'100%'}
            gap={100}
            justify='center'
            align='flex-start'
            mt={120}
        >
            <Stack>
                <Select
                    placeholder='Select a user'
                    data={users}
                    defaultValue="91235"
                    value={user.value}
                    onChange={(_value, option) => setUser(prev => option)}
                />
                <Stack>
                    <Text size='xl' fw={700}>Am I spend too much?</Text>
                </Stack>

                <Stack gap={60}>
                    <Group className={classes.item}>
                        <Text size='lg' fw={400}>Coffee</Text>
                        <Stack gap={0}>
                            <Text size='md'>${newCoffeeExpense} / week</Text>
                            <Text size='sm'>{
                                coffeeWOW > 0
                                    ? `${Number((coffeeWOW * 100).toFixed(2))}% above average`
                                    : `${Number((coffeeWOW * -100).toFixed(2))}% below average`
                            }
                            </Text>
                        </Stack>
                    </Group>

                    <Group className={classes.item}>
                        <Text size='lg' fw={400}>Food</Text>
                        <Stack gap={0}>
                            <Text size='md'>${newFoodExpense} / week</Text>
                            <Text size='sm'>
                                {
                                    foodWOW > 0
                                        ? `${Number((foodWOW * 100).toFixed(2))}% above average`
                                        : `${Number((foodWOW * -100).toFixed(2))}% below average`
                                }
                            </Text>
                        </Stack>
                    </Group>

                    <Group className={classes.item}>
                        <Text size='lg' fw={400}>Alcohol</Text>
                        <Stack gap={0}>
                            <Text size='md'>${newAlcoholExpense} / week</Text>
                            <Text size='sm'>
                                {
                                    alcoholWOW > 0
                                        ? `${Number((alcoholWOW * 100).toFixed(2))}% above average`
                                        : `${Number((alcoholWOW * -100).toFixed(2))}% below average`
                                }
                            </Text>
                        </Stack>
                    </Group>

                </Stack>
            </Stack>
            <Stack>
                <Link href={haveRecord ? '/edit' : '/add'}><Button variant='filled'>
                    {
                        haveRecord ? 'Edit expenses' : 'Add expenses'
                    }
                </Button></Link>
            </Stack>
        </Group>
    )
}

