import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { useForm } from "@tanstack/react-form";

function FieldInfo({ field }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em>{field.state.meta.errors.join(",")}</em>
            ) : null}
            {field.state.meta.isValidating ? "Validating..." : null}
        </>
    );
}

const LoginPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            console.log(value);
            const success = await login(value.username, value.password);
            if (success) navigate("/");
            else alert("Invalid credentials");
        },
    });

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}>
                <div>
                    <form.Field
                        name="username"
                        validators={{
                            onChange: ({ value }) =>
                                !value
                                    ? "A first name is required"
                                    : value.length < 3
                                    ? "First name must be at least 3 characters"
                                    : undefined,
                            onChangeAsyncDebounceMs: 500,
                        }}
                        children={(field) => {
                            return (
                                <>
                                    <label htmlFor={field.name}>
                                        Username:
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                    <FieldInfo field={field} />
                                </>
                            );
                        }}
                    />
                    <div>
                        <form.Field
                            name="password"
                            children={(field) => (
                                <>
                                    <label htmlFor={field.name}>
                                        Password:
                                    </label>
                                    <input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                    </div>
                </div>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <>
                            <button
                                type="submit"
                                disabled={!canSubmit}>
                                {isSubmitting ? "..." : "Submit"}
                            </button>
                            <button
                                type="reset"
                                onClick={(e) => {
                                    // Avoid unexpected resets of form elements (especially <select> elements)
                                    e.preventDefault();
                                    form.reset();
                                }}>
                                Reset
                            </button>
                        </>
                    )}
                />
            </form>
        </div>
    );
};

export default LoginPage;
