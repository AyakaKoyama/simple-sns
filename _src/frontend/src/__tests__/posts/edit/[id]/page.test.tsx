import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import EditPage, { postSchema } from "@/app/posts/edit/[id]/page";
import { getPost, updatePost } from "@/infra/api";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@/infra/api", () => ({
  getPost: jest.fn(),
  updatePost: jest.fn(),
}));

const renderPage = async () => {
  await act(async () => {
    render(<EditPage />);
  });
};

describe("Edit Page", () => {
  const mockPost = {
    id: "1",
    title: "新しいタイトル",
    content: "新しい内容",
    username: "テストユーザー",
  };

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
    (useRouter as jest.Mock).mockReturnValue({
      query: { id: "1" },
      push: jest.fn(),
    });

    (getPost as jest.Mock).mockResolvedValue(mockPost);
  });

  it("編集ページが正しくレンダリングされること", async () => {
    await renderPage();

    expect(screen.queryByText("タイトル")).toBeInTheDocument();
    expect(screen.queryByText("内容")).toBeInTheDocument();
  });

  it("既存のデータがフォームに表示されること", async () => {
    await renderPage();

    expect(await screen.findByDisplayValue(mockPost.title)).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue(mockPost.content)
    ).toBeInTheDocument();
  });

  it("フォームを送信するとupdatePostが呼び出されること", async () => {
    await renderPage();
    fireEvent.click(screen.getByText("タイトル"));
    fireEvent.click(screen.getByText("内容"));
    fireEvent.click(screen.getByRole("button", { name: "更新" }));
    await waitFor(() => {
      expect(updatePost).toHaveBeenCalledWith("1", {
        title: "新しいタイトル",
        content: "新しい内容",
      });
    });
  });

  it("フォームを送信するとページがリダイレクトされること", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("button", { name: "更新" }));
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/posts");
    });
  });

  it("タイトルが空の場合、バリデーションが表示されること", async () => {
    await renderPage();

    try {
      postSchema.validateSync({ content: "テスト内容" });
    } catch (error: any) {
      expect(error.errors).toContain("タイトルは必須です");
    }
  });

  it("内容が空の場合、バリデーションが表示されること", async () => {
    await renderPage();
    try {
      postSchema.validateSync({ title: "テストタイトル" });
    } catch (error: any) {
      expect(error.errors).toContain("内容は必須です");
    }
  });
});
