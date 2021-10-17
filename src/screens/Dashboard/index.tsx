import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, CardProps } from '../../components/TransactionCard';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserName,
    UserGreeting,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    ListTransactions,
    LogoutButton,
} from './styles';

export interface DataListProps extends CardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {
            id:'1',
            type: 'positive',
            title: 'Desenvolvimento do site',
            amount: 'R$12.000,00',
            category: {
                name: 'Vendas',
                icon: 'selling',
            },
            date: "13/04/2020",
        },
        {
            id:'2',
            type: 'negative',
            title: 'Desenvolvimento do site',
            amount: 'R$12.000,00',
            category: {
                name: 'Vendas',
                icon: 'food',
            },
            date: "13/04/2020",
        },
        {
            id:'3',
            type: 'positive',
            title: 'Desenvolvimento do site',
            amount: 'R$12.000,00',
            category: {
                name: 'Vendas',
                icon: 'selling',
            },
            date: "13/04/2020",
        },
        {
            id:'4',
            type: 'negative',
            title: 'Desenvolvimento do site',
            amount: 'R$12.000,00',
            category: {
                name: 'Contas da casa',
                icon: 'home',
            },
            date: "13/04/2020",
        }
    ]
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/7530294?v=4' }}
                        />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Gabriel</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => {}}>
                    <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard title="Entradas" amount="R$17.400,00" lastTransaction="Última entrada 13 de abril" type="up" />
                <HighlightCard title="Saídas" amount="R$1.259,00" lastTransaction="Última saída 03 de abril" type="down" />
                <HighlightCard title="Total" amount="R$16.141,00" lastTransaction="1 a 16 de abril" type="total" />
            </HighlightCards>

            <Transactions>
                <Title>Transações recentes</Title>

                <ListTransactions 
                data={ data } 
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard  data={ item } 
                
                />}/>

            </Transactions>
        </Container>
    )
}
