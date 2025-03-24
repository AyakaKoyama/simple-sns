import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { signIn, getCurrentUser } from "@/infra/auth";
import Page from "../../app/signin/page";
import { AuthContext } from "../../app/page";
import Cookies from "js-cookie";

// モックの設定
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/infra/auth", () => ({
  signIn: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  set: jest.fn(),
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

describe("サインインページ", () => {
  const pushMock = jest.fn();
  const setIsSignedInMock = jest.fn();
  const setCurrentUserMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    // getCurrentUserのモックを設定
    (getCurrentUser as jest.Mock).mockResolvedValue({
      data: [],
    });
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

  test("サインインフォームが正しく表示されること", () => {
    renderWithAuthContext();

    // ヘッダーテキストの確認
    expect(screen.getByText("サインイン")).toBeInTheDocument();

    // 入力フィールドの確認
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();

    // ボタンの確認
    expect(screen.getByText("登録")).toBeInTheDocument();
    expect(screen.getByText("サインアップへ")).toBeInTheDocument();
  });

  test("サインアップへボタンをクリックするとサインアップページに遷移すること", () => {
    renderWithAuthContext();

    // サインアップへボタンをクリック
    fireEvent.click(screen.getByText("サインアップへ"));

    // サインアップページへのリダイレクトを確認
    expect(pushMock).toHaveBeenCalledWith("/signup");
  });

  test("認証ロジックを直接テスト", async () => {
    // サインイン成功のレスポンスをモック
    (signIn as jest.Mock).mockResolvedValue({
      status: 200,
      headers: {
        "access-token": "fake-token",
        client: "fake-client",
        uid: "fake-uid",
      },
      data: {
        data: {
          id: 1,
          email: "test@example.com",
        },
      },
    });

    // コンポーネントのonSubmit関数を直接テスト
    const { container } = renderWithAuthContext();

    // メールとパスワードの状態を設定（プライベートな状態なのでここではモックを使う）
    // Pageコンポーネント内のstateを直接変更することはできないため、
    // イベントを発火させて状態変更をシミュレート
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // テスト用にイベントをトリガー
    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    // signInが呼び出されていることを確認
    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
    });

    // Cookiesの設定を確認
    expect(Cookies.set).toHaveBeenCalledWith("_access_token", "fake-token");
    expect(Cookies.set).toHaveBeenCalledWith("_client", "fake-client");
    expect(Cookies.set).toHaveBeenCalledWith("_uid", "fake-uid");

    // 認証状態の更新を確認
    expect(setIsSignedInMock).toHaveBeenCalledWith(true);
    expect(setCurrentUserMock).toHaveBeenCalledWith({
      id: 1,
      email: "test@example.com",
    });

    // リダイレクトを確認
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  test("認証失敗のエラーハンドリングを直接テスト", async () => {
    // コンソールエラーをモック
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    // サインイン失敗をシミュレート
    (signIn as jest.Mock).mockRejectedValue(new Error("Authentication failed"));

    // コンポーネントのonSubmit関数を直接テスト
    const { container } = renderWithAuthContext();

    // メールとパスワードの状態を設定
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // テスト用にイベントをトリガー
    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    // エラーハンドリングの確認
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    // リダイレクトされないことを確認
    expect(pushMock).not.toHaveBeenCalledWith("/");

    // クリーンアップ
    consoleSpy.mockRestore();
  });
});
