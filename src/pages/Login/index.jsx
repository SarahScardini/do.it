import React from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import api from "../../services/api";
import * as yup from "yup";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { Container, Background, Content, AnimationContainer } from "./style";
import { FiMail, FiLock } from "react-icons/fi";

function Login({ authenticated, setAuthenticated }) {
  const schema = yup.object().shape({
    email: yup.string().email("Email inválido").required("Campo obrigatório"),
    password: yup
      .string()
      .min(8, "Mínimo de 8 dígitos")
      .required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const onSubmitFunction = (data) => {
    api
      .post("/user/login", data)
      .then((response) => {
        const { token } = response.data;

        localStorage.setItem("@Doit:token", JSON.stringify(token));
        setAuthenticated(true);
        return history.push("/dashboard");
      })
      .catch((err) => toast.error("Erro ao criar a conta, tente outro email"));
  };

  if (authenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <form onSubmit={handleSubmit(onSubmitFunction)}>
            <h1>Login</h1>
            <Input
              icon={FiMail}
              name="email"
              register={register}
              label="Email"
              placeholder="Seu email"
              error={errors.email?.message}
            />
            <Input
              name="password"
              register={register}
              icon={FiLock}
              label="Senha"
              placeholder="Sua senha ultra secreta"
              type="password"
              error={errors.password?.message}
            />
            <Button type="submit">Enviar</Button>
            <p>
              Já tem uma conta? <Link to="/signup"> Faça seu cadastro</Link>
            </p>
          </form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
}

export default Login;
