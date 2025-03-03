import { useEffect, useState } from "react"

export function useAuth() {
    const [user, setUser] = useState<AuthenticateUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authenticate = async () => {
            if (typeof window === 'undefined') return;

            const pathParts = window.location.pathname.split('/');
            const token = pathParts[1];

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/user/details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if(data.status.responseCode === 200) {
                    const userData = {
                        nik: data.result.userAccount.nik,
                        branchCode: data.result.userAccount.branchCode
                    }; 
                    setUser(userData);
                    sessionStorage.setItem('user', JSON.stringify(userData));

                }    
            } catch (error) {
                console.error('Authentication error:', error)
            } finally {
                setLoading(false)
            }
        }

        authenticate();
    }, [])

    return { user, loading }
}