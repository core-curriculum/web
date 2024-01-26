import { FiExternalLink } from "react-icons/fi";
import { MdDownload, MdOutlinePictureAsPdf } from "react-icons/md";

const ExternalLinkIcon = () => {
  return <FiExternalLink className="ml-1 inline-block" />;
};

const PdfIcon = () => {
  return <MdOutlinePictureAsPdf className="mr-1 inline-block" />;
};

const DownloadIcon = () => {
  return <MdDownload className="mr-1 inline-block" />;
};

export { ExternalLinkIcon, PdfIcon, DownloadIcon };
