import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import Home from "../app/page";
import { getCurrentUser } from "@/infra/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/infra/auth", () => ({
  getCurrentUser: jest.fn(),
}));

describe("ホームページ", () => {
  const pushMock = jest.fn();
  beforeEach(() => {
    // ルーターのモックをリセット
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  test("ログインしていない場合、サインインページにリダイレクトされること", async () => {
    // ログインしていない状態をモック
    (getCurrentUser as jest.Mock).mockResolvedValue({
      data: { isLogin: false },
    });
    await act(async () => {
      render(<Home />);
    });
    // リダイレクトの確認
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/signin");
    });
  });

  test("ログインしている場合、ウェルカムメッセージが表示されること", async () => {
    // ログインしている状態をモック
    (getCurrentUser as jest.Mock).mockResolvedValue({
      data: {
        isLogin: true,
        data: {
          id: 1,
          email: "test@example.com",
        },
      },
    });
    await act(async () => {
      render(<Home />);
    });
    // ウェルカムメッセージの確認
    await waitFor(() => {
      expect(screen.queryByText("ようこそ！")).toBeInTheDocument();
    });
  });

  test("投稿一覧ボタンをクリックすると投稿一覧ページに遷移すること", async () => {
    // ログインしている状態をモック
    (getCurrentUser as jest.Mock).mockResolvedValue({
      data: {
        isLogin: true,
        data: {
          id: 1,
          email: "test@example.com",
        },
      },
    });
    await act(async () => {
      render(<Home />);
    });
    // ボタンが表示されるまで待機
    await waitFor(() => {
      expect(screen.queryByText("投稿一覧へ")).toBeInTheDocument();
    });
    // ボタンクリックのシミュレーション
    await act(async () => {
      screen.getByText("投稿一覧へ").click();
    });
    // 投稿一覧ページへのリダイレクト確認
    expect(pushMock).toHaveBeenCalledWith("/posts");
  });

  test("ローディング中は何も表示されないこと", async () => {
    // レスポンスを遅延させてローディング状態をシミュレート
    (getCurrentUser as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: { isLogin: true, data: { id: 1, email: "test@example.com" } },
          });
        }, 100);
      });
    });
    // renderを実行し、containerを取得
    const { container } = render(<Home />);
    // ローディング中は何も表示されないことを確認
    expect(container.textContent).toBe("");
    // ローディング完了後は内容が表示されることを確認
    await waitFor(() => {
      expect(screen.queryByText("ようこそ！")).toBeInTheDocument();
    });
  });
});
