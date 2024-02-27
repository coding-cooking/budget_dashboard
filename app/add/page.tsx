'use client'

import { Form, valuesInterface } from '@/components/Form/Form';
import { useUserContext } from '@/context/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function AddExpenses() {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const [coffeeExpense, setCoffeeExpense] = useState<number>(0);
    const [foodExpense, setFoodExpense] = useState<number>(0);
    const [alcoholExpense, setAlcoholExpense] = useState<number>(0);
    const { user, setUser } = useUserContext();

    const createExpense = async (values:valuesInterface) => {
        setSubmitting(true);
        try{
            const response = await fetch('api/expenses/new',{
                method: 'post',
                body: JSON.stringify({
                    user_id: user.value.toString(),
                    date: new Date(),
                    coffee_expense: values.coffee,
                    food_expense: values.food,
                    alcohol_expense: values.alcohol,
                })
            });
            if (response.ok) {
                console.log('______', values.coffee, values.food, values.alcohol)
                setCoffeeExpense(prevCoffee => values.coffee);
                setFoodExpense(prevFood => values.food);
                setAlcoholExpense(prevAlcohol => values.alcohol); 
                router.push('/');
            }
        }catch(error){
            console.log(error)
        }finally{
            setSubmitting(false)
        }
    }

    useEffect(()=> {
        console.log('hahahhahha', coffeeExpense, foodExpense, alcoholExpense)
    }, [coffeeExpense, foodExpense, alcoholExpense])

    return <Form
        coffeeExpense={coffeeExpense}
        foodExpense={foodExpense}
        alcoholExpense={alcoholExpense}
        handleSubmit={createExpense}
    />
}