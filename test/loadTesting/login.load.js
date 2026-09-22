import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Load test for POST /login
 * Threshold: p95 < 500ms for 30 VUs over 30s
 * Stages: 10 users in 5s -> 30 users for 20s -> ramp down to 0 in 5s
 */
export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 30 },
    { duration: '5s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500']
  }
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    username: 'alice',
    password: 'password123'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = http.post(`${BASE_URL}/login`, payload, params);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response has token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return typeof body.token === 'string' && body.token.length > 0;
      } catch (e) {
        return false;
      }
    },
    'login message is success': (r) => {
      try {
        return JSON.parse(r.body).message === 'Login successful';
      } catch (e) {
        return false;
      }
    }
  });

  sleep(1);
}
