import { Box, Text, VStack } from "@chakra-ui/react";
import DataWrapper from "../../component/DataWrapper";
import Header from "../../component/Header";
import Hero from "./component/Hero";
import { useEffect, useContext, useState } from "react";
import ConnectorCardList from "./component/ConnectorCardList";
import axios from "axios";

const DataConnectors = () => {
  useEffect(() => {
    axios
      .get("https://prifina-data-mine.vercel.app/api/data-connectors/")
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <Box textAlign="center" fontSize="xl" bg={"bgLight"}>
      <VStack justifyContent={"stretch"} minH="100vh" spacing={0}>
        <Header />
        <Hero />
        <DataWrapper>
          <ConnectorCardList />
        </DataWrapper>
      </VStack>
    </Box>
  );
};
export default DataConnectors;
