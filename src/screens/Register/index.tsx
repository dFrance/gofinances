import React, {useState} from 'react';
import { Modal } from 'react-native'

import { Input } from '../../components/Form/Input';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import {useForm} from 'react-hook-form'

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

export function Register() {
    const [buttonSelect, setButtonSelect] = useState();
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    
    const {
        control,
        handleSubmit,
    } = useForm();

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Selecione uma categoria',
    })

    function handleTransactionTypeSelect(type: string ){
       setButtonSelect(type); 
    }

    function handleOpenSelectionCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectionCategory() {
        setCategoryModalOpen(false)
    }

    function handleRegister(form: FormData){
        const data = {
            name: form.name,
            amount: form.amount,

        }
    }
    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
                <Fields>
                    <InputForm 
                    name="Nome" 
                    control={control} 
                    placeholder="Nome"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    />
                    <InputForm 
                    name="Preço" 
                    control={control} 
                    placeholder="Preço"
                    keyboardType='numeric'
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
                    onPress={handleOpenSelectionCategoryModal}/>
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
    );
}