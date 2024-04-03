import MlClientSearch from "./MlClientSearch/MlClientSearch";
import index from "../../pwa_config/data/searchIndex.json";
import { SearchContextInterface } from "./MlClientSearch/lib/searchContext";
import { Box } from "@mui/material";

const ClientSearch: React.FC = () => {
  return (
    <>
      {index && (
        <MlClientSearch
          searchIndex={
            index as unknown as SearchContextInterface["searchIndex"]
          }
          fields={{ HALTESTELLE: { expand: true } }}
          renderOption={(props: any, option: any) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {option.HALTESTELLE}
            </Box>
          )}
          searchFieldLabel="Haltestellensuche"
        />
      )}
    </>
  );
};

export default ClientSearch;
