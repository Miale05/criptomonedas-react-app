import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import Error from './Error';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import axios from 'axios';

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326AC0;
        cursor: pointer;
    }
`;

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    //State de listado de criptomonedas
    const [ listacripto, guardarCriptomonedas] = useState([]);
    const [ error, guardarError] = useState(false);

    const MONEDAS = [
        {codigo: 'USD', nombre: '(USD) Dolar de Estados Unidos'},
        {codigo: 'MXN', nombre: '(MXN) Peso Mexicano'},
        {codigo: 'EUR', nombre: '(EUR) Euro'},
        {codigo: 'PEN', nombre: '(PEN) Nuevo Sol Peruano'},
    ]

    // utilizar useMoneda
    const [moneda, SelectMonedas] = useMoneda('Elige tu Moneda', '', MONEDAS);

    //Utilizar useCriptomoneda
    const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu Criptomoneda', '', listacripto);

    // Ejecutar llamado a la API
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);

            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI();
    }, []);

    //Cuando el usuario hace submit
    const cotizarMoneda = e => {
        e.preventDefault();

        //validar si ambos campos estan llenos
        if(moneda === '' || criptomoneda === '') {
            guardarError(true);
            return;
        }

        // pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }

    return (
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los campos son obligatorios" /> : null }

            <SelectMonedas />

            <SelectCripto />
            
            <Boton
                type="submit"
                value="Calcular"
            />
        </form>
    )
}

Formulario.propTypes = {
    guardarMoneda: PropTypes.func.isRequired,
    guardarCriptomoneda: PropTypes.func.isRequired
}

export default Formulario;