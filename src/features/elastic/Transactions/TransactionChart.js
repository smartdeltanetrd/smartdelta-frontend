import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from "react";
import getServiceTransactions from '../actions/getServiceTransactions';
import TextMobileStepper from './Stepper';
import useLastPartOfUrl from 'hooks/useLastPartOfUrl';
const TransactionsChart = () => {
	const [durations, setDurations] = useState(null);
	const [timestamps, setTimestamps] = useState(null);
	const[stepperData, setStepperData] = useState(null);
	const lastPartOfUrl = useLastPartOfUrl();

	useEffect(async() => {
		const transactions = await getServiceTransactions(lastPartOfUrl);
		
		const durs = transactions.map(item => 
			item.span?.duration?.us ?? item.transaction?.duration?.us
		  ).filter(duration => duration !== undefined);
		  

		setDurations(durs);
		const tims =  transactions.map(item => new Date(item['@timestamp']).getTime());
		setTimestamps(tims);

console.log('Index DURATIONS:')
    console.log(durs);
	console.log('ındec TIMESTAMPS:')
	console.log(tims);
	 const steps = transactions.map(({
		destination,
		span,
		http,
		agent,
		data_stream,
		event,
		host,
		timestamp
	}, index) => ({
		label: `Transaction ${index + 1}`,
		transactionInfo: {
			destination,
			span,
			http
		},
		metadata: {
			agent,
			data_stream,
			event,
			host,
			timestamp
		}
	}));
	
	console.log(' STEPS:')
	
	setStepperData(steps);

	
	
	}, [stepperData]);

  const options = {
    chart: {
      id: 'chartspan',
      type: 'area',
      height: 180,
	 
    },
	dataLabels: {
		enabled: false
	  },
	  stroke: {
		curve: 'straight'
	  },
	  
	  title: {
		text: 'Transaction Analysis',
		align: 'left'
	  },
	  subtitle: {
		text: 'Duration Movements',
		align: 'left'
	  },
	  xaxis: {
		type: 'datetime',
	  },
	  yaxis: {
		opposite: true
	  },
	  legend: {
		horizontalAlign: 'left'
	  }
	
 
  };

  return (
    <div id="chart-span">
      <ReactApexChart options={{...options, xaxis: {...options.xaxis, categories: timestamps}}} series={[{ name: 'span duration', data: durations }]} type="area"  height={180} />
	  <TextMobileStepper steps={stepperData} />
    </div>
  );
};

export default TransactionsChart;
