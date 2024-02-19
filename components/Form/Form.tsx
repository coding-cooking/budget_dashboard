'use client'

import { Button, Center, Code, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import classes from './Form.module.css';

type FormProps = {
    coffeeExpense: number,
    foodExpense: number,
    alcoholExpense: number,
    setCoffeeExpense: (arg: number) => void,
    setFoodExpense: (arg: number) => void,
    setAlcoholExpense: (arg: number) => void,
    submitting: boolean,
    handleSubmit: () => void
}

export const Form = ({ coffeeExpense, foodExpense, alcoholExpense, setCoffeeExpense, setFoodExpense, setAlcoholExpense, submitting, handleSubmit }: FormProps) => {
    const [submittedValues, setSubmittedValues] = useState('');
    const router = useRouter();
    const form = useForm({
        initialValues: {
            coffee: coffeeExpense,
            food: foodExpense,
            alcohol: alcoholExpense,
        },
        transformValues: (values) => ({
            coffee: Number(values.coffee),
            food: Number(values.food),
            alcohol: Number(values.alcohol),
        }),
    });

    useEffect(() => {
        console.log('$$$$$',coffeeExpense,foodExpense,alcoholExpense);
        console.log('&&&&&', submittedValues);
        console.log('&&&&&', submittedValues['coffee']);
        setCoffeeExpense(submittedValues['coffee']);
        setFoodExpense(submittedValues['food']);
        setAlcoholExpense(submittedValues['alcohol']);
    }, [submittedValues])

    return (
        <Center style={{ width: '100%', height: '100%' }}>
            <Stack
                maw={'60%'}
                mih={'100%'}
                gap={40}
                justify='center'
                align='center'
                mt={120}
            >
                <Text size='xl' fw={700}>
                    How much did I spend today?
                </Text>
                <form onSubmit={form.onSubmit((values) => {
                    setSubmittedValues(JSON.stringify(values, null, 2));
                    handleSubmit();
                })} >
                    <Stack>
                        <TextInput label='Coffee' type='number' min={1} max={100}  {...form.getInputProps('coffee')}/>
                        <TextInput label='Food' type='number' min={1} max={100} {...form.getInputProps('food')} />
                        <TextInput label='Alcohol' type='number' min={1} max={100} {...form.getInputProps('alcohol')} />
                    </Stack>
                    <Group className={classes.btns}>
                        <Link href={'/'}><Button variant='default'>Back</Button></Link>
                        <Button
                            type='submit'
                            variant='filled'
                        // onClick={() => { router.push('/') }}
                        >
                            Add expenses</Button>
                    </Group>
                </form>
                {submittedValues && <Code block>{submittedValues}</Code>}
            </Stack>
        </Center>
    )
}