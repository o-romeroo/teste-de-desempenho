/**
 * Etapa 1: Smoke Test
 * 
 * Objetivo: Verificar se a API está de pé antes de iniciar testes pesados.
 * Config: 1 usuário (VUser) por 30 segundos acessando /health.
 * Critério de Sucesso: 100% de sucesso nas requisições.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate==0'],
        http_req_duration: ['p(95)<200'],
    },
};

export default function () {
    const res = http.get('http://localhost:3000/health');
    
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has status UP': (r) => r.json('status') === 'UP',
        'response has timestamp': (r) => r.json('timestamp') !== undefined,
    });
    
    sleep(1);
}
