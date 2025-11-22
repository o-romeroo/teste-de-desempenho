/**
 * Etapa 4: Teste de Pico (Spike Testing)
 * 
 * Cenário: Simular um comportamento de "Flash Sale" (ex: abertura de venda de ingressos)
 * Alvo: Endpoint /checkout/simple
 * Objetivo: Verificar como o sistema se comporta com um aumento súbito de carga
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '10s', target: 300 },
        { duration: '1m', target: 300 },
        { duration: '10s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        http_req_failed: ['rate<0.05'],
    },
};

export default function () {
    const payload = JSON.stringify({
        userId: `user_${__VU}`,
        product: 'Flash Sale Item',
        amount: 49.90,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post('http://localhost:3000/checkout/simple', payload, params);
    
    check(res, {
        'status is 201': (r) => r.status === 201,
        'transaction approved': (r) => r.json('status') === 'APPROVED',
        'response time acceptable': (r) => r.timings.duration < 2000,
    });
    
    sleep(1);
}
