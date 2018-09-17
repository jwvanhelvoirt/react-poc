import React from 'react';
import classes from './timespan.scss';

const resize = (size, resizeTo) => {
  // The timespan has three different sizes (200px, 150px and 100px). Calculation is based on 200px size.
  // Check if there's another size applicable and adjust the size accordingly.
  switch (resizeTo) {
    case 'TimespanMedium':
      return .75 * size;
      break;
    case 'TimespanSmall':
      return .5 * size;
      break;
    default:
      return size;
  }
};

const timespan = (props) => {
  const startDate = new Date(props.start);
  const endDate = new Date(props.end);
  const currentDate = new Date();

  // Calculate the nummber of days between the start date and the current date (this can be a negative number).
  var timeDiffStart = startDate.getTime() - currentDate.getTime();
  var diffDaysStart = Math.ceil(timeDiffStart / (1000 * 3600 * 24));

  // Calculate the nummber of days between the end date and the current date (this can be a negative number).
  var timeDiffEnd = endDate.getTime() - currentDate.getTime();
  var diffDaysEnd = Math.ceil(timeDiffEnd / (1000 * 3600 * 24));

  // Objects to store dynamic styles.
  const stylePastFilled = {};
  const styleFutureFilled = {};

  // By default our timespan covers a period of 730 days (two years).
  const totalDays = 730;

  let start = 0;
  let end = 0;
  let width = 0;

  // Fill the objects containing the dynamic styles.
  if (diffDaysStart >= 0 && diffDaysEnd >= 0) {
    // Start date is in the future.

    start = diffDaysStart - (totalDays/2) >= 0 ? 100 : (diffDaysStart / (totalDays/2)) * 100;
    end   = diffDaysEnd   - (totalDays/2) >= 0 ? 100 : (diffDaysEnd   / (totalDays/2)) * 100;

    start = props.size != 'TimespanLarge' ? resize(start, props.size) : start;
    end   = props.size != 'TimespanLarge' ? resize(end, props.size)   : end;

    width = end - start;
    styleFutureFilled.marginLeft = start + 'px';
    styleFutureFilled.width = width + 'px';
  } else if (diffDaysStart < 0 && diffDaysEnd >= 0) {
    // End date is in the future, but start date has passed.

    start = (Math.abs(diffDaysStart) / (totalDays/2)) * 100;
    end = (diffDaysEnd / (totalDays/2)) * 100;

    start = props.size != 'TimespanLarge' ? resize(start, props.size) : start;
    end   = props.size != 'TimespanLarge' ? resize(end, props.size)   : end;

    stylePastFilled.width = start + 'px';
    styleFutureFilled.width = end + 'px';
  } else if (diffDaysStart < 0 && diffDaysEnd < 0) {
    // Both start and end date have passed.

    start = Math.abs(diffDaysStart) - (totalDays/2) >= 0 ? 100 : (Math.abs(diffDaysStart) / (totalDays/2)) * 100;
    end   = Math.abs(diffDaysEnd)   - (totalDays/2) >= 0 ? 100 : (Math.abs(diffDaysEnd)   / (totalDays/2)) * 100;

    start = props.size != 'TimespanLarge' ? resize(start, props.size) : start;
    end   = props.size != 'TimespanLarge' ? resize(end, props.size)   : end;

    width = start - end;
    stylePastFilled.marginRight = end + 'px';
    stylePastFilled.width = width + 'px';
  }

  return(
    <div className={classes[props.size]}>
			<div className={classes.Past}>
				<div className={classes.PastFilled} style={stylePastFilled}></div>
			</div>
			<div className={classes.CurrentDay}></div>
			<div className={classes.Future}>
				<div className={classes.FutureFilled} style={styleFutureFilled}></div>
			</div>
		</div>
  );
};

export default timespan;




/*
Varianten:
1. Start ligt in de toekomst (52). End natuurlijk dan ook in de toekomst (282).
    52/365 = 14%
    14% van 100px =  14px
    14% van 75px =   10px
    14% van 50px =   7px

    282/365 = 77%
    77% van 100px =  77px
    77% van 75px =   57px
    77% van 50px =   38px

    De margin-left is dus 14px (uitgaande van de 100px grootte)
    De width is nu 77px - 14px = 63px.
    Dus:  .FutureFilled { width: 63px; margin-left: 14px }

2. Start ligt in het verleden (-195), end ligt in toekomst (23)
    195/365 = 53%
    53% van 100px = 53px

    23/365 = 6%
    6% van 100px = 6px

    Dus:  .PastFilled { width: 53px }
          .FutureFilled { width: 6px; }
          3. Start ligt in het verleden (560), end ligt ook in het verleden (98)
              560/365 = 100%
              100% van 100px = 100px

              98/365 = 26%
              26% van 100px = 26px

              De margin-right is dus 26px
              De width is nu 100px - 26px = 74px
              Dus:  .PastFilled { width: 74px; margin-right: 26px }

3 sizes:
TimespanLarge   100px = 100%
TimespanMedium  75px  = 100%
TimespanSmall   50px  = 100%

1. Verschil in dagen berekenen tussen start en current. (start - current)
    a. Als negatief, dan gedeelte in the past (rood)
    b. Als positief, dan alles in the future (groen)
2. Verschil in dagen berekenen tussen end en current. (end - current)
    a. Als negatief, dan rood
    b. Als positief, dan groen

margin-left : als einddatum reeds in het verleden ligt
margin-right: als startdatum in de toekomst ligt
  */
