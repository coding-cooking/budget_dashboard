'use client'

import { expenseInterface } from '@/components/ExpenseDashboard/Dashboard';
import { Form, valuesInterface } from '@/components/Form/Form';
import { useUserContext } from '@/context/user';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditExpenses() {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const [coffeeExpense, setCoffeeExpense] = useState<number>(0);
    const [foodExpense, setFoodExpense] = useState<number>(0);
    const [alcoholExpense, setAlcoholExpense] = useState<number>(0);
    const [expenseId, setExpenseId] = useState<string>('');
    const { user, setUser } = useUserContext();

    useEffect(()=> {
        const getExpenseDetails = async () => {
            const response = await fetch('api/expenses');
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            const today = format(new Date(), 'yyyy-MM-dd');
            console.log("$$$$$$",today)
            const ExpenseofToday = data.filter((expense: expenseInterface) => Number(expense.user_id) === Number(user.value) && format(parseISO(expense.date.toLocaleString()), 'yyyy-MM-dd') === today);
            console.log("jintiandexiaofeishi", ExpenseofToday[0].id)
            setCoffeeExpense(ExpenseofToday[0].coffee_expense);
            setFoodExpense(ExpenseofToday[0].food_expense);
            setAlcoholExpense(ExpenseofToday[0].alcohol_expense);
            setExpenseId(ExpenseofToday[0].id);
        }
        if (user) getExpenseDetails();
    },[])

    useEffect(()=> {
        console.log('.....',coffeeExpense);
        console.log('.....', foodExpense);
        console.log('.....', alcoholExpense);
    }, [coffeeExpense, foodExpense, alcoholExpense])

    const editExpense = async (values: valuesInterface) => {
        setSubmitting(true);
        const parsedDate = formatInTimeZone(new Date(), 'Australia/Sydney', 'yyyy-MM-dd HH:mm:ss');
        try {
            const response = await fetch('api/expenses/update', {
                method: 'put',
                body: JSON.stringify({
                    id: expenseId,
                    user_id: user.value.toString(),
                    date: parsedDate,
                    coffee_expense: values.coffee,
                    food_expense: values.food,
                    alcohol_expense: values.alcohol,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log('Response from server:', response);
            console.log('update', values.coffee, values.food, values.alcohol,)
            if (response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.log('something is wrong',error)
        } finally {
            setSubmitting(false)
        }
    }

    return <Form
        coffeeExpense={coffeeExpense}
        foodExpense={foodExpense}
        alcoholExpense={alcoholExpense}
        handleSubmit={editExpense}
    />
}