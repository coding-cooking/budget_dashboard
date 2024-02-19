import { Center, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'

export default function NotFound() {
    return (
        <Center>
            <Stack justify='center' align='center' mt={120} >
                <Title size='h2'>Not Found</Title>
                <Text>Could not find requested resource</Text>
                <Link href="/">Return Home</Link>
            </Stack>
        </Center>
    )
}