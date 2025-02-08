import Page from "@/app/posts/page";
import { getPosts } from "@/infra/api";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// APIモックの作成
jest.mock("@/infra/api", () => ({
  getPosts: jest.fn(),
}));

const mockedUseRouter = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => mockedUseRouter(),
  usePathname: jest.fn().mockReturnValue("/posts/create"),
}));

describe("投稿一覧ページ", () => {
  const mockPosts = [
    {
      id: 1,
      title: "テストタイトル1",
      content: "テスト内容1",
      username: "テストユーザー1",
    },
    {
      id: 2,
      title: "テストタイトル2",
      content: "テスト内容2",
      username: "テストユーザー2",
    },
  ];

  beforeEach(() => {
    (getPosts as jest.Mock).mockClear();
  });

  it("初期状態でローディング表示がされること", () => {
    render(<Page />);
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("タイトルが表示されること", async () => {
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    render(<Page />);
    await waitFor(() => {
      expect(screen.getByText("投稿一覧")).toBeInTheDocument();
    });
  });

  it("投稿一覧が正常に表示されること", async () => {
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    render(<Page />);

    // ローディング表示の確認
    expect(screen.getByText("loading...")).toBeInTheDocument();

    // 投稿一覧の表示を待機
    await waitFor(() => {
      expect(screen.getByText("テストタイトル1")).toBeInTheDocument();
      expect(screen.getByText("テストタイトル2")).toBeInTheDocument();
    });
  });

  it("投稿が存在しない場合、適切なメッセージが表示されること", async () => {
    (getPosts as jest.Mock).mockResolvedValue([]);
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText("投稿がありません")).toBeInTheDocument();
    });
  });

  it.skip("APIエラー時にエラーメッセージが表示されること", async () => {
    const errorMessage = "APIエラーが発生しました";
    (getPosts as jest.Mock).mockRejectedValue(new Error(errorMessage));
    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText(`Error:${errorMessage}`)).toBeInTheDocument();
    });
  });

  it("新規作成ボタンがクリックできること", () => {
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
    });
    render(<Page />);

    fireEvent.click(screen.getByText("新規作成"));
    expect(mockedUseRouter).toHaveBeenCalled();
  });
});
