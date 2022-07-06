import {
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import TableData from "components/admin/TableData";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ModalAddProduct from "components/admin/ModalAddProduct";
import { useEffect, useState } from "react";
import ModalAddStock from "components/admin/ModalAddStock";
import axiosInstance from "configs/api";
import { useRouter } from "next/router";

const Products = () => {
  const router = useRouter();
  const [Open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const [page, setPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(5);
  const [sortBy, setSortBy] = useState();
  const [sortDir, setSortDir] = useState();
  const [filterCategory, setFilterCategory] = useState(
    router.query.filter_by_category
  );
  const [searchInput, setSearchInput] = useState("");

  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [pageIsReady, setPageIsReady] = useState(false);
  const [searchValue, setSearchValue] = useState(router.query.product_name);

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get("/products/quantity", {
        params: {
          name: searchValue,
          // selectedCategory: selectedCategory || undefined,
          _sortBy: sortBy ? sortBy : undefined,
          _sortDir: sortDir ? sortDir : undefined,
          _limit: rowPerPage,
          _page: page + 1,
        },
      });

      const data = res.data.result.rows;

      setTotalData(res.data.result.count);

      setRows(
        data.map((val, idx) => {
          return {
            no: idx + rowPerPage * page + 1,
            namaObat: val.name,
            noObat: val?.no_medicine,
            noBpom: val?.no_bpom,
            kategori: val.Category.name,
            stok: val.Stock_opnames[0]?.amount,
            satuan: val?.packaging,
            nilaiJual: val.price,
            productId: val.id,
            diskon: val.discount,
          };
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowPerPage(+event.target.value);
    setPage(0);
  };

  const searchInputHandler = (event) => {
    const { value } = event.target;

    setSearchInput(value);
  };

  const searchButton = () => {
    setSearchValue(searchInput);
    setPage(0);
  };

  useEffect(() => {
    if (router.isReady) {
      if (router.query.product_name) {
        setSearchValue(router.query.product_name);
      }
      // if (router.query._sortDir) {
      //   setSortDir(router.query._sortDir);
      // }
      // if (router.query._sortBy) {
      //   setSortBy(router.query._sortBy);
      // }
      // if (router.query.selectedCategory) {
      //   setSelectedCategory(router.query.selectedCategory);
      // }
      setPageIsReady(true);
    }
  }, [router.isReady]);

  console.log(fetchProduct);

  useEffect(() => {
    fetchProduct();

    if (searchValue) {
      router.push({
        query: {
          product_name: searchValue,
        },
      });
    }
    if (searchValue === "") {
      router.replace("/admin/inventory/products", undefined, { shallow: true });
    }
    // if (pageIsReady) {
    //   fetchProduct();

    //   router.push({
    //     query: {
    //       name: searchValue,
    //       // _sortBy: sortBy ? sortBy : undefined,
    //       // _sortDir: sortDir ? sortDir : undefined,
    //       _page: page ? page : undefined,
    //       // selectedCategory: selectedCategory || undefined,
    //     },
    //   });
    // }
  }, [rowPerPage, page, searchValue, pageIsReady]);

  return (
    <Container
      sx={{
        p: "20px",
        marginTop: "16px",
      }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Daftar Obat
          </Typography>
          <Box display="flex">
            <Button
              sx={{ marginRight: "15px" }}
              variant="outlined"
              startIcon={<DownloadIcon />}
            >
              Unduh PDF
            </Button>
            <Button variant="outlined" startIcon={<InsertDriveFileIcon />}>
              Excel
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          mt: "38px",
          borderRadius: "8px",
          height: "73vh",
          overflow: "scroll",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="24px"
          >
            <OutlinedInput
              placeholder="Cari nama obat"
              onChange={searchInputHandler}
              sx={{ width: "328px", height: "42px" }}
              endAdornment={
                <InputAdornment>
                  <SearchIcon
                    onClick={searchButton}
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                      },
                    }}
                  />
                </InputAdornment>
              }
            />
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
              >
                Tambah Obat
              </Button>
            </Box>
          </Box>
          <Divider />
          <ModalAddProduct
            open={Open}
            handleClose={handleClose}
            fetchProduct={fetchProduct}
          />
        </Box>
        <Box sx={{ px: 3, mb: 3 }}>
          <TableData
            rows={rows}
            page={page}
            rowPerPage={rowPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalData={totalData}
            fetchProduct={fetchProduct}
          ></TableData>
        </Box>
      </Box>
    </Container>
  );
};

export default Products;
