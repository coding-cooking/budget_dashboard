'use client'

import { Button, Center, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from "next/link";
import classes from './Form.module.css';
import { useEffect } from 'react';

export type valuesInterface = {
    coffee: number,
    food: number,
    alcohol: number,
}

type FormProps = {
    coffeeExpense: number,
    foodExpense: number,
    alcoholExpense: number,
    handleSubmit: (values: valuesInterface) => void
}

export const Form = ({ coffeeExpense, foodExpense, alcoholExpense, handleSubmit }: FormProps) => {
    useEffect(() => {
        form.setValues({
            coffee: coffeeExpense,
            food: foodExpense,
            alcohol: alcoholExpense,
        })
    }, [coffeeExpense, foodExpense, alcoholExpense])

    const form = useForm<valuesInterface>({
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
                <form onSubmit={form.onSubmit((values: valuesInterface) => handleSubmit(values))} >
                    <Stack>
                        <TextInput label='Coffee' type='number' min={1} max={100}  {...form.getInputProps('coffee')} />
                        <TextInput label='Food' type='number' min={1} max={100} {...form.getInputProps('food')} />
                        <TextInput label='Alcohol' type='number' min={1} max={100} {...form.getInputProps('alcohol')} />
                    </Stack>
                    <Group className={classes.btns}>
                        <Link href={'/'}><Button variant='default'>Back</Button></Link>
                        <Button
                            type='submit'
                            variant='filled'
                        >
                            Add expenses</Button>
                    </Group>
                </form>
            </Stack>
        </Center>
    )
}