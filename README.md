# Beam Adjudication Engine

Beam is processing our own claims, and we need to make an adjudication engine, that judges whether or not we need to pay the claim, depending on many factors. One of your coworkers started the engine, but left for a vacation, so we need you to pick up the slack.

## Install Dependencies

yarn install

## Getting started

yarn start

## Run Tests

yarn test

## Instructions

There are several steps to this adjudicator, some of which your coworker roughed in for you (yay!). Here's a breakdown of the remaining work:

1. We need to match each claim with a provider record from our network. You can get our network data in CSV format from an API endpoint. The data is available at http://provider-data.beam.dental/beam-network.csv . Luckily for you, there's only a few records.
2. Unfortunately, our data sources sometimes aren't the best. So, after fetching this data, you should sort out ones with bad NPI's -- national provider ID's.
    1. A valid NPI should be of length 10.
    2. A valid NPI only has numeric (0-9) characters.
    3. Log bad NPI's to STDERR.
3. We will have claims data provided via an argument to the command line interface. You can run `yarn test`. For ease of ad hoc testing.
4. Next, the claims data needs to be matched up to providers. Luckily, we import the claims with an NPI included, so just match those up to the appropriate provider record.
5. Now that we have a claims matched up to valid providers in our network, let's adjudicate the claim. Here are the rules you'll adjudicate with:
    1. As you can see in the claims JSON fixture, a claim is an instance of a visit to the dentist. It has line items, which are individual services billed by the dentist. Each line item or service is adjudicated by itself, and can be rejected or paid by itself.
    2. Reject any duplicate claims. A duplicate claim is defined as having the same start date, patient SSN, and procedures codes as another claim. All but the first claim in a duplicate set should be rejected.
    3. If the provider was not successfully matched, reject the claim and all of its line items. This plan does not cover out of network at all. :(
    4. Fully pay any preventive and diagnostic codes. Luckily, your coworker already provided a helper method on the `ClaimLineItem` model to help you figure this out.
    5. Pay any orthodontic line item at 25% of the charged rate. Again, your coworker added a helper method on `ClaimLineItem` to help you with this.
    6. Reject anything else.
    7. Log any rejections to STDERR.

In order to allow the CLI (in the `bin` folder) to work properly, the `Engine.run` method should return processed claims.
