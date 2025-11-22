/**
 * Etapa 3: Teste de Estresse (Stress Testing)
 * 
 * Objetivo: Quantos usuários fazendo cálculos de criptografia (CPU Heavy) derrubam o servidor?
 * Alvo: Endpoint /checkout/crypto
 * Cenário: Aumentar a carga agressivamente até encontrar o ponto de ruptura
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 200 },
        { duration: '2m', target: 500 },
        { duration: '2m', target: 1000 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.1'],
    },
};

export default function () {
    const payload = JSON.stringify({
        userId: `user_${__VU}`,
        product: 'Secure Transaction',
        amount: 199.90,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post('http://localhost:3000/checkout/crypto', payload, params);
    
    check(res, {
        'status is 201': (r) => r.status === 201,
        'secure transaction processed': (r) => r.json('status') === 'SECURE_TRANSACTION',
        'has hash': (r) => r.json('hash') !== undefined,
    });
    
    sleep(1);
}
