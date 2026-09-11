import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default async () => {
  render(<App />, document.body);
};

/**
 * The B2B pricing discount has nothing to configure here: the percent lives
 * on each customer (metafield "B2B discount %"), so this block only tells the
 * merchant where the number comes from. The admin page around it still owns
 * title, active dates and combinations.
 */
function App() {
  const {i18n} = shopify;
  return (
    <s-function-settings>
      <s-section>
        <s-stack gap="base">
          <s-heading>{i18n.translate('title')}</s-heading>
          <s-paragraph>{i18n.translate('body')}</s-paragraph>
          <s-paragraph>{i18n.translate('hint')}</s-paragraph>
        </s-stack>
      </s-section>
    </s-function-settings>
  );
}
