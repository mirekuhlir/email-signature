import { Img } from "@/components/ui/img";
import { ContentType } from "@/const/content";

export const getContentView = (content?: any) => {
  if (content.type == ContentType.IMAGE && content.image) {
    return (
      <Img
        src={
          "https://fastly.picsum.photos/id/159/140/140.jpg?hmac=Aa3iY6i0Z1Nf_lx_RWn-hSXKm6jTfHbJE7P-trDe-6Y"
        }
      />
    );
  }

  if (content.type === ContentType.TEXT && content?.text) {
    const { text, fontSize, textColor, letterSpacing, ...rest } = content;

    return (
      <span
        style={{
          display: "inline-block",
          width: "100%",
          fontSize: `${fontSize}px`,
          color: textColor,
          letterSpacing: `${letterSpacing}px`,
          ...rest,
        }}
      >
        {text}
      </span>
    );
  }

  return null;
};
