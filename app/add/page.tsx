'use client'

import { Form, valuesInterface } from '@/components/Form/Form';
import { useUserContext } from '@/context/user';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
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
            const parsedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const response = await fetch('api/expenses/new',{
                method: 'post',
                body: JSON.stringify({
                    user_id: user.value.toString(),
                    date: parsedDate,
                    coffee_expense: values.coffee,
                    food_expense: values.food,
                    alcohol_expense: values.alcohol,
                })
            });
            if (response.ok) {
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
    }, [coffeeExpense, foodExpense, alcoholExpense])

    return <Form
        coffeeExpense={coffeeExpense}
        foodExpense={foodExpense}
        alcoholExpense={alcoholExpense}
        handleSubmit={createExpense}
    />
}