'use client'

import { Form } from '@/components/Form/Form';
import { useUserContext } from '@/context/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function AddExpenses() {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const [coffeeExpense, setCoffeeExpense] = useState<number>(0);
    const [foodExpense, setFoodExpense] = useState<number>(0);
    const [alcoholExpense, setAlcoholExpense] = useState<number>(0);
    const { user, setUser } = useUserContext();

    const createExpense = async () => {
        setSubmitting(true);
        try{
            const response = await fetch('api/expenses/new',{
                method: 'post',
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
        }catch(error){
            console.log(error)
        }finally{
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
        handleSubmit={createExpense}
    />
}