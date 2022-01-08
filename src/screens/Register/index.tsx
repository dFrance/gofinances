import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
// import { CategorySelect } from '../../components/CategorySelect';

import uuid from 'react-native-uuid'
import { useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes,
} from './styles';
import { CategorySelectButton } from '../../components/CategorySelect';
import { CategorySelect } from '../CategorySelect';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é obrigatório!'),
    amount: Yup
        .number()
        .typeError('Informe um valor numérico!')
        .positive('O valor não pode ser negativo!')
        .required('Quantia é obrigatório!')
})

export function Register() {
    const [typeTransaction, setTypeTransaction] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const dataKeyTransactions = '@gofinances:transactions';
    const navigation = useNavigation();


    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Selecione uma categoria',
    })

    function handleTransactionTypeSelect(type: 'positive' | 'negative') {
        setTypeTransaction(type);
    }

    function handleOpenSelectionCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectionCategory() {
        setCategoryModalOpen(false)
    }

    async function handleRegister(form: FormData) {
        if (!typeTransaction) {
            return Alert.alert('Selecione o tipo da transação')
        }
        if (category.key === 'category') {
            return Alert.alert('Selecione uma categoria')
        }



        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: typeTransaction,
            category: category.key,
            date: new Date(),
        }

        console.log(newTransaction)


        try {
            const getData = await AsyncStorage.getItem(dataKeyTransactions)
            const currentData = getData ? JSON.parse(getData) : [];
            const newData = [...currentData, newTransaction];
            console.log(newData)
            await AsyncStorage.setItem(dataKeyTransactions, JSON.stringify(newData));

            reset()
            setCategory({
                key: 'category',
                name: 'Selecione uma categoria',
            })
            setTypeTransaction('')

            Alert.alert(
                `Transação ${newTransaction.name} cadastrada com sucesso.`,
                'Deseja cadastrar uma nova transação?',
                [
                    {
                        text: "Não",
                        onPress: () => navigation.navigate('Listagem'),

                    },
                    { text: "Sim" }
                ]
            )


        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possível salvar a transação.")
        }
    }


    async function getTransactions() {
        const getData = await AsyncStorage.getItem(dataKeyTransactions)
        const parseData = JSON.parse(getData!)
        return parseData
    }

    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
        >
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionsTypes>
                            <TransactionTypeButton
                                type='up'
                                title='Entrada'
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={typeTransaction === 'positive'}
                            />
                            <TransactionTypeButton
                                type='down'
                                title='Saída'
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={typeTransaction === 'negative'}
                            />
                        </TransactionsTypes>
                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectionCategoryModal} />
                    </Fields>
                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)} />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectionCategory}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}