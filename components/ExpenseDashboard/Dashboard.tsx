'use client'

import { Button, Text, Group, Stack, Select } from '@mantine/core';
import Link from 'next/link';
import classes from './Dashboard.module.css';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/user';
import { compareAsc, format } from 'date-fns';

export const ExpenseDashboard = () => {
    const [users, setUsers] = useState(null);
    const { user, setUser } = useUserContext();
    const [newCoffeeExpense, setNewCoffeeExpense] = useState<number>(0);
    const [coffeeWOW, setCoffeeWOW] = useState<number>(0);
    const [newFoodExpense, setNewFoodExpense] = useState<number>(0);
    const [foodWOW, setFoodWOW] = useState<number>(0);
    const [newAlcoholExpense, setNewAlcoholExpense] = useState<number>(0);
    const [alcoholWOW, setAlcoholWOW] = useState<number>(0);
    const [haveRecord, setHaveRecord] = useState<boolean>(false);

    type userInterface = {
        user_id: string,
    }

    type expenseInterface = {
        id: string,
        user_id: string,
        date: Date,
        coffee_expense: number,
        food_expense: number,
        alcohol_expense: number,
    }

    const getUsers = async () => {
        const response = await fetch('api/users');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const userIds = data.map((user: userInterface) => (user.user_id).toString());
        setUsers(userIds);
    }

    const getExpenses = async () => {
        const response = await fetch('api/expenses');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const currentUserExpenses = data.filter((expense: expenseInterface) => Number(expense.user_id) === Number(user?.value));
        const sortedCurrentUserExpenses = currentUserExpenses.sort((a: expenseInterface, b: expenseInterface) => compareAsc(new Date(a.date), new Date(b.date)));
        const newExpenses = sortedCurrentUserExpenses.slice(-7);
        // console.log('new expenses are', newExpenses[0].date);
        const prevExpenses = sortedCurrentUserExpenses.slice(Math.max(0, sortedCurrentUserExpenses.length - 8 - 7), sortedCurrentUserExpenses.length - 8 + 1);
        // console.log('prev expenses are', prevExpenses);

        //coffee expense
        const _new_coffee_expense = newExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur.coffee_expense), 0);
        // console.log(_new_coffee_expense);
        setNewCoffeeExpense(_new_coffee_expense);
        const prev_coffee_expense = prevExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur.coffee_expense), 0);
        // console.log(prev_coffee_expense);
        const _coffeeWoW = (newCoffeeExpense / 7 - (prev_coffee_expense / prevExpenses.length)) / (newCoffeeExpense / 7);
        // console.log('....', _coffeeWoW);
        setCoffeeWOW(_coffeeWoW);

        //food expense
        const _new_food_expense = newExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur.food_expense), 0);
        // console.log('food', _new_food_expense);
        setNewFoodExpense(_new_food_expense);
        const prev_food_expense = prevExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur.food_expense), 0);
        // console.log(prev_food_expense);
        const _foodWoW = (newFoodExpense / 7 - (prev_food_expense / prevExpenses.length)) / (newFoodExpense / 7);
        // console.log('....', _foodWoW);
        setFoodWOW(_foodWoW);

        //alcohol expense
        const _new_alcohol_expense = newExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur.alcohol_expense), 0);
        // console.log('alcohol', _new_alcohol_expense);
        setNewAlcoholExpense(_new_alcohol_expense);
        const prev_alcohol_expense = prevExpenses.reduce((prev: number, cur: expenseInterface) => prev + Number(cur.alcohol_expense), 0);
        // console.log(prev_alcohol_expense);
        const _alcoholWoW = (newAlcoholExpense / 7 - (prev_alcohol_expense / prevExpenses.length)) / (newAlcoholExpense / 7);
        // console.log('....', _alcoholWoW);
        setAlcoholWOW(_alcoholWoW);

        const today = format(new Date(), 'yyyy-MM-dd')
        const _haveRecord = currentUserExpenses.find((expense: expenseInterface) => format(expense.date, 'yyyy-MM-dd') === today);
        if (_haveRecord) {
            setHaveRecord(true);
        } else {
            setHaveRecord(false);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        // console.log('user is', user)
        getExpenses();
    },)

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
                    onChange={(_value, option) => setUser(option)}
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
                                    ? `${(Number(coffeeWOW.toFixed(2)) * 100)}% above average`
                                    : `${(Number(coffeeWOW.toFixed(2)) * -100)}% below average`
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
                                        ? `${(Number(foodWOW.toFixed(2)) * 100)}% above average`
                                        : `${(Number(foodWOW.toFixed(2)) * -100)}% below average`
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
                                        ? `${(Number(alcoholWOW.toFixed(2)) * 100)}% above average`
                                        : `${(Number(alcoholWOW.toFixed(2)) * -100)}% below average`
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

