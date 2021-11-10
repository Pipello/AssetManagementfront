import {useRef, useEffect} from "react";

export function useDidMount() {
    const didMountRef = useRef(true);
    
    useEffect(() => {
      didMountRef.current = false;
    }, []);
    return didMountRef.current;
};

export const API_URL = 'http://localhost:8100/am_core/'