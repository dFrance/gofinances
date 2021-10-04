import React from 'react'

import { Container } from './styles'

interface Props {
    title: string;
    type: 'up' | 'down';
}

export function TransactionTypeButton({title, type} : Props) {
    return (
        <Container>
            <Icon />
            <Title>

            </Title>
        </Container>
    )
}