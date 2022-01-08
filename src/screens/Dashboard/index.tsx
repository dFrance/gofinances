import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, CardProps } from '../../components/TransactionCard';
import { getTransactions } from '../../services/api';
import { useTheme } from 'styled-components'

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
    LoadingContainer,
} from './styles';
import { Alert } from 'react-native';

export interface DataListProps extends CardProps {
    id: string;
}

interface HighlightTypes{
    amount: string,
    lastTransaction: string,
}
interface HighlightProps {
    Income: HighlightTypes;
    Outcome: HighlightTypes;
    Total: HighlightTypes;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState<DataListProps>([])
    const theme = useTheme();
    const [highlightData, setHighLightData] = useState<HighlightProps>({
        Income: {
            amount: '0',
            lastTransaction: "",
        }, Outcome: {
            amount: '0',
            lastTransaction: "",
        }, Total: {
            amount: '0',
            lastTransaction: "",
        },
    });

    function getLastTransaction(collection: DataListProps[], type: 'positive' | 'negative' | 'total') {
        const lastTransactionIncome =
            Math.max.apply(Math, collection.filter(transaction => transaction.type === type)
                .map(transaction => new Date(transaction.date).getTime()))

        return Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'long',
        }).format(new Date(lastTransactionIncome))
    }

    async function getTransactions() {
        setIsLoading(true)
        const dataKeyTransactions = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKeyTransactions)
        const transactions = response ? JSON.parse(response) : [];

        let Income = 0;
        let Outcome = 0;
        let Total = 0;

        const formatResponse: DataListProps[] = transactions.map((item: DataListProps) => {

            if (item.type === 'positive') {
                Income += Number(item.amount);
                Total += Number(item.amount);
            } else if (item.type === 'negative') {
                Outcome += Number(item.amount);
                Total -= Number(item.amount);
            } else {
                Alert.alert('Erro ao selecionar o tipo de transação.')
            }

            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date))

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });

        setTransactions(formatResponse)

        const lastIncomeTransaction = getLastTransaction(transactions, 'positive')
        const lastOutcomeTransaction = getLastTransaction(transactions, 'negative')
        const intervalTotalTransaction = `01 à ${lastOutcomeTransaction}`

        setHighLightData({
            Income: {
                amount: Income.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastIncomeTransaction,
            },
            Outcome: {
                amount: Outcome.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastOutcomeTransaction,
            },
            Total: {
                amount: Total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: intervalTotalTransaction,
            }
        })

        setIsLoading(false)
    }

    function resetAsyncStorage() {
        const dataKeyTransactions = '@gofinances:transactions';
        AsyncStorage.removeItem(dataKeyTransactions)
    }

    useEffect(() => {
        getTransactions()

        // resetAsyncStorage()
    }, [])

    useFocusEffect(useCallback(() => {
        getTransactions()
    }, []))
    return (
        <Container>
            {isLoading ?
                    <LoadingContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadingContainer>
                :
                <>
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
                            <LogoutButton onPress={() => { }}>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlightCard
                            title="Entradas"
                            amount={highlightData.Income.amount}
                            lastTransaction={`Última entrada dia ${highlightData.Income.lastTransaction}`}
                            type="up"
                        />
                        <HighlightCard
                            title="Saídas"
                            amount={highlightData.Outcome.amount}
                            lastTransaction={`Última saída dia ${highlightData.Outcome.lastTransaction}`}
                            type="down"
                        />
                        <HighlightCard
                            title="Total"
                            amount={highlightData.Total.amount}
                            lastTransaction={`${highlightData.Total.lastTransaction}`}
                            type="total"
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Transações recentes</Title>

                        <ListTransactions
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item}

                            />} />

                    </Transactions>
                </>
            }
        </Container>
    )
}
