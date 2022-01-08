import React from 'react'
import { categories } from '../../utils/categories'

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

// interface CategoryProps {
//     name: string;
//     icon: 'selling' | 'food' | 'home';
// }

export interface CardProps {
    data: {
        type: 'positive' | 'negative';
        name: string;
        amount: string;
        category: string;
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
    const [category] = categories.filter( item => item.key === data.category);
    console.log(data)
    return (
        <Container>
            <Title>{data.name}</Title>
            <Amount type={data.type}>
                {data.type === 'negative' && '- '}
                {data.amount}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>
                    {data.date}
                </Date>
            </Footer>
        </Container>
    )
}