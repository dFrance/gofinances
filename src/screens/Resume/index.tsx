import React, { useCallback, useEffect, useState } from 'react'

import { useTheme } from 'styled-components'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryCard } from '../../components/HistoryCard'
import {
    Container,
    Content,
    Header,
    ChartContainer,
    Title,
    SelectIcon,
    MonthSelectButton,
    Month,
    MonthSelect,
    LoadingContainer
} from './styles'
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export interface CardProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryProps {
    name: string,
    total: number,
    color: string,
    totalFormatted: string,
    key: string,
    percent: string,
}

export function Resume() {
    const [isLoading, setIsLoading] = useState(false)
    const [totalByCategories, setTotalByCategories] = useState<CategoryProps>([])
    const [selectedDate, setSelectedDate] = useState(new Date());
    const theme = useTheme();

    function handleChangeDate(action: 'next' | 'prev') {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        } else {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    async function getTransactions() {
        try {
            setIsLoading(true)
            const dataKeyTransactions = '@gofinances:transactions';
            const response = await AsyncStorage.getItem(dataKeyTransactions)
            const responseFormatted = response ? JSON.parse(response) : []
            const totalByCategory = []
            const expensives = responseFormatted
                .filter((expensive: CardProps) =>
                    expensive.type === 'negative' &&
                    new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                    new Date(expensive.date).getFullYear() === selectedDate.getFullYear())

            const expensiveTotal = expensives.reduce((acc: number, expensive: CardProps) => {
                return acc + Number(expensive.amount)
            }, 0)
            categories.forEach(category => {
                let categorySum = 0;

                expensives.forEach((expensive: CardProps) => {
                    if (expensive.category === category.key) {
                        categorySum += Number(expensive.amount)
                    }
                })

                if (categorySum > 0) {
                    const totalFormatted = categorySum.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })

                    const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`;

                    totalByCategory.push({
                        key: category.key,
                        name: category.name,
                        color: category.color,
                        total: categorySum,
                        percent,
                        totalFormatted
                    });
                }
            });

            setTotalByCategories(totalByCategory)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possível carregar suas transações.")
        }
    }

    useFocusEffect(useCallback(() => {
        getTransactions()
    }, [selectedDate]))
    
    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {isLoading ?
                <LoadingContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadingContainer>
                :
                <>

                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight(),
                        }}
                    >
                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleChangeDate('prev')}>
                                <SelectIcon name="chevron-left" />
                            </MonthSelectButton>
                            <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>
                            <MonthSelectButton onPress={() => handleChangeDate('next')}>
                                <SelectIcon name="chevron-right" />
                            </MonthSelectButton>
                        </MonthSelect>
                        <ChartContainer>
                            <VictoryPie
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={80}
                                x="percent"
                                y="total"
                            />
                        </ChartContainer>
                        {
                            totalByCategories.map(item => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color} />
                            ))
                        }
                    </Content>
                </>}
        </Container>
    )
}