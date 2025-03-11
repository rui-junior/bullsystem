
interface FormattedDateProps {
  isoString: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ isoString }) => {
  if (!isoString) return null; // Evita erro se a string estiver vazia

  // Função para formatar a data
  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return <>{formatDateTime(isoString)}</>
};

export default FormattedDate;
