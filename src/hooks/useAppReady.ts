import { useEffect, useState } from "react";
import { sqliteService } from "../services/sqliteService";

export const useAppReady = () => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prepare = async () => {
      try {
        await sqliteService.init((p) => {
          setProgress(p);
        });
        await new Promise(resolve => setTimeout(resolve, 300));
      } finally {
        setReady(true);
      }
    };

    prepare();
  }, []);

  return { ready, progress };
};
