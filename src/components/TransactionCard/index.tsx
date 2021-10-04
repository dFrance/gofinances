import React from 'react'

import { 
    Container,
    Title, 
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
} from './styles'

interface CategoryProps {
    name: string;
    icon: 'selling' | 'food' | 'home' ;
}

export interface CardProps {
    data: {
        type: 'positive' | 'negative';
        title: string;
        amount: string;
        category: CategoryProps;
        date: string;
    }
}

const icon = {
    selling: "dollar-sign",
    food: "coffee",
    home: "home",
}

export function TransactionCard(
    {data}: CardProps) {
    return (
        <Container>
            <Title>{data.title}</Title>
            <Amount type={data.type}>
            {data.type === 'negative' && '- '}    
                {data.amount}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={icon[data.category.icon]} />
                    <CategoryName>{data.category.name}</CategoryName>
                </Category>
                <Date>
                    {data.date}
                </Date>
            </Footer>
        </Container>
    )
}