import React, { useState } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'

import { Input } from '../../components/Form/Input';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { useForm } from 'react-hook-form'
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
    const [buttonSelect, setButtonSelect] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Selecione uma categoria',
    })

    function handleTransactionTypeSelect(type: string) {
        setButtonSelect(type);
    }

    function handleOpenSelectionCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectionCategory() {
        setCategoryModalOpen(false)
    }

    function handleRegister(form: FormData) {
        if (!buttonSelect) {
            return Alert.alert('Selecione o tipo da transação')
        }
        if (category.key === 'category') {
            return Alert.alert('Selecione uma categoria')
        }


        const data = {
            name: form.name,
            amount: form.amount,

        }

        console.log(data)
    }
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
                                onPress={() => handleTransactionTypeSelect('up')}
                                isActive={buttonSelect === 'up'}
                            />
                            <TransactionTypeButton
                                type='down'
                                title='Saída'
                                onPress={() => handleTransactionTypeSelect('down')}
                                isActive={buttonSelect === 'down'}
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