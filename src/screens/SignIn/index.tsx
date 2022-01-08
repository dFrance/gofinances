import React, { useContext } from 'react'
import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles'

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { SingInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

export function SignIn() {
    const { SignInWithGoogle } = useAuth()
    
    async function handleSignInWithGoogle(){
        try {
            await SignInWithGoogle();
        } catch (error) {
            console.log(error)
            Alert.alert("Ocorreu um problema ao realizar o login.")
        }
    }
    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Controle suas{'\n'}
                        finanças de forma{'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>
                <SignInTitle>
                    Faça seu login com{'\n'}
                    umas das contas abaixo
                </SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SingInSocialButton 
                    title="Entrar com Google" 
                    svg={GoogleSvg} 
                    onPress={handleSignInWithGoogle}
                    />
                    <SingInSocialButton title="Entrar com Apple" svg={AppleSvg} />
                </FooterWrapper>
            </Footer>
        </Container>
    )
}