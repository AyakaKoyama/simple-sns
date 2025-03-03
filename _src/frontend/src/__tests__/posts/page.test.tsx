import Page from "@/app/posts/page";
import DeleteModal from "@/component/deleteModal";
import { deletePost, getPosts, updatePost } from "@/infra/api";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

// APIモックの作成
jest.mock("@/infra/api", () => ({
  getPosts: jest.fn(),
  deletePost: jest.fn(),
  updatePost: jest.fn(),
}));

jest.mock("@/component/deleteModal", () => {
  return jest.fn(() => <div>Mocked Delete Modal</div>);
});

const mockedUseRouter = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => mockedUseRouter(),
}));

const renderPage = async () => {
  await act(async () => {
    render(<Page />);
  });
};

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

  it.skip("初期状態でローディング表示がされること", async () => {
    await renderPage();
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("タイトルが表示されること", async () => {
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    await renderPage();
    await waitFor(() => {
      expect(screen.getByText("投稿一覧")).toBeInTheDocument();
    });
  });

  it("投稿一覧が正常に表示されること", async () => {
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    await renderPage();
    await waitFor(async () => {
      expect(screen.getByText("テストタイトル1")).toBeInTheDocument();
      expect(screen.getByText("テストタイトル2")).toBeInTheDocument();
    });
  });

  it("投稿が存在しない場合、適切なメッセージが表示されること", async () => {
    (getPosts as jest.Mock).mockResolvedValue([]);
    await renderPage();

    await waitFor(() => {
      expect(screen.getByText("投稿がありません")).toBeInTheDocument();
    });
  });

  it("APIエラー時にエラーメッセージが表示されること", async () => {
    const errorMessage = "APIエラーが発生しました";
    (getPosts as jest.Mock).mockRejectedValue(new Error(errorMessage));
    await renderPage();

    await waitFor(async () => {
      expect(screen.getByText(`Error:${errorMessage}`)).toBeInTheDocument();
    });
  });

  it("新規作成ボタンがクリックできること", async () => {
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
    });
    await renderPage();

    fireEvent.click(screen.getByText("新規作成"));

    expect(mockedUseRouter().push).toHaveBeenCalledWith("/posts/create");
  });

  it("削除ボタンがあること", async () => {
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    await renderPage();
    expect(screen.getAllByTestId("delete-modal-button")[0]).toBeInTheDocument();
  });

  it("削除ボタンを押下すると削除モーダルが呼ばれる", async () => {
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    await renderPage();
    fireEvent.click(screen.getAllByTestId("delete-modal-button")[0]);
    expect(screen.getAllByText("Mocked Delete Modal")[0]).toBeInTheDocument();
  });

  it("削除APIエラー時にエラーメッセージが表示されること", async () => {
    const errorMessage = "APIエラーが発生しました";
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    (getPosts as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    await renderPage();
    expect(screen.getByText(`Error:${errorMessage}`)).toBeInTheDocument();
  });

  it("編集ボタンを押下すると編集ページに遷移すること", async () => {
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
      usePathname: jest.fn().mockReturnValue("/posts/edit/${id}"),
    });
    (getPosts as jest.Mock).mockResolvedValue(mockPosts);
    await renderPage();
    fireEvent.click(screen.getAllByTestId("edit-button")[0]);
    expect(mockedUseRouter().push).toHaveBeenCalledWith("/posts/edit/1");
  });
});
