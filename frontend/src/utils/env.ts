interface EnvConfig {
  END_POINT: string;
}

const env: EnvConfig = {
  END_POINT: import.meta.env.VITE_BACKEND_URL,
};

export default env;
