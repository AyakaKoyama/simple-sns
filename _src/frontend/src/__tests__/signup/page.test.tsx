import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { signUp } from "@/infra/auth";
import Page from "../page";
import { AuthContext } from "../../page";

// モックの設定
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/infra/auth", () => ({
  signUp: jest.fn(),
}));

// react-hook-formとyupのバリデーションバイパス
jest.mock("react-hook-form", () => {
  const original = jest.requireActual("react-hook-form");
  return {
    ...original,
    useForm: () => ({
      register: () => ({}),
      handleSubmit: (fn: () => void) => (e: { preventDefault: () => void }) => {
        e.preventDefault();
        fn();
      },
      formState: { errors: {} },
      reset: jest.fn(),
    }),
  };
});

// authSchemaモック
jest.mock("@/component/authValidation", () => ({
  authSchema: {},
}));

// envモック
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_FRONTEND_URL: "http://localhost:3000",
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe("サインアップページ", () => {
  const pushMock = jest.fn();
  const setIsSignedInMock = jest.fn();
  const setCurrentUserMock = jest.fn();
  const mockAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    // windowのalertをモック
    global.alert = mockAlert;
  });

  const renderWithAuthContext = () => {
    return render(
      <AuthContext.Provider
        value={{
          isSignedIn: false,
          setIsSignedIn: setIsSignedInMock,
          currentUser: null,
          setCurrentUser: setCurrentUserMock,
        }}
      >
        <Page />
      </AuthContext.Provider>
    );
  };

  test("サインアップフォームが正しく表示されること", () => {
    renderWithAuthContext();

    // ヘッダーテキストの確認
    expect(screen.getByText("サインアップ")).toBeInTheDocument();

    // 入力フィールドの確認
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード確認")).toBeInTheDocument();

    // ボタンの確認
    expect(screen.getByText("登録")).toBeInTheDocument();
    expect(screen.getByText("サインインへ")).toBeInTheDocument();
  });

  test("サインインへボタンをクリックするとサインインページに遷移すること", () => {
    renderWithAuthContext();

    // サインインへボタンをクリック
    fireEvent.click(screen.getByText("サインインへ"));

    // サインインページへのリダイレクトを確認
    expect(pushMock).toHaveBeenCalledWith("/signin");
  });

  test("サインアップフォーム送信で正しいパラメータでAPIが呼ばれること", async () => {
    // サインアップ成功のレスポンスをモック
    (signUp as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        status: "success",
        message: "メール送信成功",
      },
    });

    // コンポーネントのonSubmit関数を直接テスト
    const { container } = renderWithAuthContext();

    // メールとパスワードの状態を設定
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const confirmPasswordInput = screen.getByLabelText("パスワード確認");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    // テスト用にイベントをトリガー
    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    // signUpが呼び出されていることを確認
    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
    });

    // 適切なパラメータでAPIが呼ばれていること
    expect(signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      passwordConfirmation: "password123",
      confirmSuccessUrl: "http://localhost:3000",
    });

    // アラートが表示されることを確認
    expect(mockAlert).toHaveBeenCalledWith("confirm email");
  });

  test("サインアップエラーが適切に処理されること", async () => {
    // コンソールエラーをモック
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // サインアップ失敗をシミュレート
    (signUp as jest.Mock).mockRejectedValue(new Error("Registration failed"));

    // コンポーネントのonSubmit関数を直接テスト
    const { container } = renderWithAuthContext();

    // フォームに入力
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const confirmPasswordInput = screen.getByLabelText("パスワード確認");

    fireEvent.change(emailInput, { target: { value: "error@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    // テスト用にイベントをトリガー
    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    // エラーハンドリングの確認
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    // クリーンアップ
    consoleSpy.mockRestore();
  });
});
