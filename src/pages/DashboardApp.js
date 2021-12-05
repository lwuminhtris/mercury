/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

// material
import {
  Box,
  Grid,
  Container,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';

// axios
import axios from 'axios';

// redux
import { useSelector } from 'react-redux';

// components
import numeral from 'numeral';
import Page from '../components/Page';
import {
  AppTasks,
  // AppNewUsers,
  // AppBugReports,
  // AppItemOrders,
  AppNewsUpdate,
  // AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  // AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates,
  AppFeedReport
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [data, setData] = useState([
    {
      title: '',
      time: '',
      content: '',
      percentage: 0
    }
  ]);

  const user = useSelector((state) => state.login.userList);

  const countOccurrences = (arr, val) => {
    let count = 0;
    arr.forEach((e) => {
      if (e.rating === val) count += 1;
    });
    return count;
  };

  const [totalGood, updateTotalGood] = useState([]);
  const [totalPotential, updateTotalPotential] = useState([]);
  const [totalQuestion, updateTotalQuestion] = useState([]);
  const [totalBad, updateTotalBad] = useState([]);

  const getPercentage = (e) => {
    const potential = countOccurrences(e.comments, 'potential');
    updateTotalPotential([...totalPotential, potential]);
    const good = countOccurrences(e.comments, 'good');
    updateTotalGood([...totalGood, good]);
    const question = countOccurrences(e.comments, 'question');
    updateTotalQuestion([...totalQuestion, question]);
    const bad = countOccurrences(e.comments, 'bad');
    updateTotalBad([...totalBad, bad]);
    // console.log(`${e.content} potential`, potential);
    return (100 * (good + potential)) / (good + potential + question + bad);
  };

  const getFeedById = async (pageId) => {
    const result = [];
    await axios.get(`http://127.0.0.1:5000/page/${pageId}/feeds`).then((res) => {
      const resData = res.data;
      resData.forEach((e, idx) => {
        const percentage = getPercentage(e);
        result.push({
          title: '',
          time: '',
          content: e.content,
          percentage
        });
      });
    });
    return result;
  };

  const [selectedPageId, setSelectedPageId] = useState('');
  const [renderedName, setRenderedName] = useState('Tên trang');

  function renderMultipleFeed(numbers) {
    const listOfAppFeedback = numbers.map((number, idx) => {
      const margin = {
        top: 2.5,
        bottom: 2.5
      };
      if (number === 1) {
        margin.top = 0;
      }
      if (number === 5) {
        margin.bottom = 0;
      }
      return (
        <AppFeedReport
          key={idx}
          id={idx}
          pageId={selectedPageId}
          title={renderedName}
          content={data[number].content}
          time="15:00PM, 02/12/2021"
          percentage={data[number].percentage}
          marginTop={margin.top}
          marginBottom={margin.bottom}
        />
      );
    });
    return listOfAppFeedback;
  }

  const handlePageChange = (event) => {
    setSelectedPageId(event.target.value);
    const idx = user.page_ids.indexOf(event.target.value);
    setRenderedName(user.page_names[idx]);
    setData('');
    async function retrieveFeed() {
      const feed = await getFeedById(event.target.value);
      setData(feed);
    }
    retrieveFeed();
  };

  function renderMultipleMenuItem() {
    const pageIds = user.page_ids;
    const pageNames = user.page_names;
    const multipleChoices = pageIds.map((pageId, idx) => (
      <MenuItem key={pageId} value={pageId}>
        {pageNames[idx]}
      </MenuItem>
    ));
    return multipleChoices;
  }

  return (
    <Page title="Bảng điều khiển">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4" style={{ marginBottom: 5 }}>
            Chào buổi trưa @{user.username}{' '}
            <span role="img" aria-label="hi-five">
              🙌
            </span>
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            {/* <AppWebsiteVisits /> */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Chọn trang cần theo dõi</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPageId}
                label="Chọn trang cần theo dõi"
                onChange={handlePageChange}
                width={20}
              >
                {renderMultipleMenuItem()}
              </Select>
            </FormControl>
            {renderMultipleFeed(Array.from(Array(data.length).keys()))}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              good={totalGood}
              potential={totalPotential}
              question={totalQuestion}
              bad={totalBad}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {/* <AppConversionRates /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* <AppCurrentSubject /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {/* <AppNewsUpdate /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* <AppOrderTimeline /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* <AppTrafficBySite /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {/* <AppTasks /> */}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
