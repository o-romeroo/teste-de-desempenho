/**
 * Etapa 2: Teste de Carga (Load Testing)
 * 
 * Cenário: O Marketing anunciou uma promoção e esperamos um pico de 50 usuários simultâneos.
 * Alvo: Endpoint /checkout/simple
 * SLA: p95 < 500ms e erros < 1%
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 },
        { duration: '2m', target: 50 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const payload = JSON.stringify({
        userId: `user_${__VU}`,
        product: 'Premium Plan',
        amount: 99.90,
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
        'has transaction id': (r) => r.json('id') !== undefined,
    });
    
    sleep(1);
}
