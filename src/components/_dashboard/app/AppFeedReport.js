/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Card,
  CardHeader,
  Box,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Paper,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Collapse
} from '@mui/material';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import faker from 'faker';

AppFeedReport.propTypes = {
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  title: PropTypes.string,
  time: PropTypes.string,
  content: PropTypes.string,
  percentage: PropTypes.number
};

AppFeedReportCard.propTypes = {
  children: PropTypes.element,
  percentage: PropTypes.number
};

function DetailStatistic(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      // onClose={() => props.setOpenDialog(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Thống kê chi tiết</DialogTitle>
      <DialogContent>
        <DialogContentText>Cập nhật mỗi 5s</DialogContentText>
        <Line data={data} options={options} />
      </DialogContent>
      <DialogActions>
        {/* <Button autoFocus onClick={props.handleClose}>
          Thoas
        </Button> */}
        <Button onClick={() => props.handleClose(false)} autoFocus>
          Thoát
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DetailedComment(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const columns = [
    {
      field: 'comment',
      headerName: 'Bình Luận',
      editable: false,
      headerAlign: 'center',
      minWidth: 650
    },
    {
      field: 'outcome',
      headerName: 'Phân loại',
      editable: true,
      headerAlign: 'center',
      minWidth: 200
    }
  ];

  // let rows = [{ id: 0, comment: 'WTF', outcome: 'FTW' }];
  const [rows, setRowsValue] = useState([]);

  const { id } = props;
  const { pageId } = props;

  const get = async () => {
    const comments = [];
    const ratings = [];
    const rows = [];
    await axios.get(`http://127.0.0.1:5000/page/${pageId}/feeds`).then((res) => {
      const { data } = res;
      // console.log(data);
      data.map((e, idx) => {
        if (idx === id) {
          e.comments.map((c) => {
            comments.push(c.message);
            ratings.push(c.rating);
            // console.log(c.message, c.rating);
            return null;
          });
        }
        return null;
      });
    });
    // console.log(comments, ratings);
    comments.forEach((e, idx) => {
      rows.push({ id: idx, comment: e, outcome: ratings[idx] });
    });
    return rows;
  };

  useEffect(() => {
    // async function retrieve() {
    //   const tempRows = await get();
    //   setRowsValue(tempRows);
    // }
    // retrieve();
    const offlineTest = [
      { id: 0, comment: 'T1', outcome: 'bad' },
      { id: 1, comment: 'T2', outcome: 'good' },
      { id: 2, comment: 'T3', outcome: 'potential' }
    ];
    setRowsValue(offlineTest);
  }, []);

  const [rowsEdit, setRowsEditValue] = useState({});

  const handleRowsEditValueChange = React.useCallback((model) => {
    setRowsEditValue(model);
    rows.forEach((e, idx) => {
      if (rowsEdit[idx] !== undefined) {
        const outcome = rowsEdit[idx].outcome.value;
        if (
          (outcome === 'good' ||
            outcome === 'bad' ||
            outcome === 'potential' ||
            outcome === 'question') &&
          outcome !== e.outcome
        ) {
          const feedback = { content: e.comment, outcome };
          axios.post('http://127.0.0.1:5000/feedback', feedback).then(() => {
            window.alert('Cập nhật thành công, +50đ tín dụng xã hội');
          });
        }
      }
    });
  });

  return (
    <Dialog
      fullScreen={fullScreen}
      open={props.open}
      fullWidth
      maxWidth="md"
      scroll="paper"
      // onClose={() => props.setOpenDialog(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Chi tiết bình luận</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>Phân loại bình luận</DialogContentText> */}
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          editRowsModel={rowsEdit}
          onEditRowsModelChange={handleRowsEditValueChange}
        />
      </DialogContent>
      <DialogActions>
        {/* <Button autoFocus onClick={props.handleClose}>
          Thoas
        </Button> */}
        <Button onClick={() => props.handleClose(false)} autoFocus>
          Thoát
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AppFeedReportCard({ children, percentage }) {
  const cardPallete = {
    extremePositive: '#328511',
    positive: '#85c46c',
    negative: '#f0811a',
    extremeNegative: '#de2828'
  };

  const cardColor = (percentage) => {
    if (percentage < -50) {
      return cardPallete.extremeNegative;
    }
    if (percentage >= -50 && percentage < 0) {
      return cardPallete.negative;
    }
    if (percentage >= 0 && percentage < 50) {
      return cardPallete.positive;
    }
    return cardPallete.extremePositive;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      maxWidth="md"
    >
      <div
        style={{
          maxWidth: '70%'
        }}
      >
        {children}
      </div>
      <Paper
        sx={{
          display: 'flex',
          position: 'absolute',
          maxWidth: 68,
          maxHeight: 34,
          minWidth: 16,
          minHeight: 8,
          width: 68,
          height: 34,
          backgroundColor: cardColor(percentage),
          right: '24px',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 4
        }}
        elevation={5}
      >
        <Typography
          component="p"
          children={`${numeral(percentage).format('0.00')}%`}
          sx={{
            fontSize: '0.8em'
          }}
          color="white"
        />
      </Paper>
    </Box>
  );
}

export default function AppFeedReport(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openComment, setOpenComment] = useState(false);

  const { id } = props;
  const { pageId } = props;

  // console.log(`app feed report id ${id} with ${pageId}`);

  return (
    <div>
      <Card
        sx={{
          marginTop: props.marginTop,
          marginBottom: props.marginBottom
        }}
      >
        <AppFeedReportCard
          children={
            <CardHeader
              title={props.title}
              subheader={props.time}
              avatar={
                <Avatar alt="ava" src="https://mui.com/static/images/cards/live-from-space.jpg" />
              }
            />
          }
          percentage={props.percentage}
          id={props.id}
        />
        {/* <Box dir="ltr" /> */}
        <CardContent>
          <Typography component="p">{props.content}</Typography>
        </CardContent>
        <CardActions>
          <Button
            size="medium"
            style={{ marginLeft: 16, marginTop: -10, marginBottom: 16 }}
            variant="contained"
            onClick={() => setOpenComment(true)}
          >
            Bình luận chi tiết
          </Button>
          <DetailedComment
            open={openComment}
            handleClose={setOpenComment}
            id={id}
            pageId={pageId}
          />

          <Button
            size="medium"
            style={{ marginTop: -10, marginBottom: 16 }}
            variant="contained"
            onClick={() => setOpenDialog(true)}
          >
            Thống kê tương tác
          </Button>
          <DetailStatistic open={openDialog} handleClose={setOpenDialog} />
        </CardActions>
        <Collapse />
      </Card>
    </div>
  );
}
