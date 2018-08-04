import { TimeClockPage } from './app.po';

describe('time-clock App', function() {
  let page: TimeClockPage;

  beforeEach(() => {
    page = new TimeClockPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
