'use client'

import { Form } from '@/components/Form/Form';
import { useUserContext } from '@/context/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditExpenses() {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const [coffeeExpense, setCoffeeExpense] = useState<number>(0);
    const [foodExpense, setFoodExpense] = useState<number>(0);
    const [alcoholExpense, setAlcoholExpense] = useState<number>(0);
    const { user, setUser } = useUserContext();

    useEffect(()=> {
        const getExpenseDetails = async () => {
            const response = await fetch('api/expenses');
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = (today.getMonth() + 1).toString();
            let dd = (today.getDate() - 2).toString();
            mm = Number(mm) < 10 ? `0${mm}` : mm;
            dd = Number(dd) < 10 ? `0${dd}` : dd;
            const todayStr = `${yyyy}-${mm}-${dd}`;
            const ExpenseofToday = data.filter(expense => expense.user_id === Number(user.value) && expense.date.toString().slice(0, 10) === todayStr);
            setCoffeeExpense(ExpenseofToday[0].coffee_expense);
            setFoodExpense(ExpenseofToday[0].food_expense);
            setAlcoholExpense(ExpenseofToday[0].alcohol_expense);
        }
        if (user) getExpenseDetails();
    },[])

    useEffect(()=> {
        console.log('.....',coffeeExpense);
        console.log('.....', foodExpense);
        console.log('.....', alcoholExpense);
    }, [coffeeExpense, foodExpense, alcoholExpense])

    const editExpense = async () => {
        setSubmitting(true);
        try {
            const response = await fetch('api/expenses/update', {
                method: 'patch',
                body: JSON.stringify({
                    user_id: user.value.toString(),
                    date: new Date(),
                    coffee_expense: coffeeExpense,
                    food_expense: foodExpense,
                    alcohol_expense: alcoholExpense,
                })
            });
            if (response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    }

    

    return <Form

        coffeeExpense={coffeeExpense}
        foodExpense={foodExpense}
        alcoholExpense={alcoholExpense}
        setCoffeeExpense={setCoffeeExpense}
        setFoodExpense={setFoodExpense}
        setAlcoholExpense={setAlcoholExpense}
        submitting={submitting}
        handleSubmit={editExpense}
    />
}