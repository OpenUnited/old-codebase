from points_and_payments.models import *
from django.test import TestCase

from commercial.models import Organisation
from talent.models import Person
from users.models import User
from .utils import *

import uuid


class PointAcquisitionTests(TestCase):

    def setUp(self):
        org = Organisation.objects.create(name="Test Co", username="testco")
        OrganisationAccount.objects.create(organisation=org, liquid_points_balance=0, nonliquid_points_balance=0)
        user1 = User.objects.create(id=uuid.uuid4(),username="adrian")
        bee_keeper1 = Person.objects.create(user=user1,first_name="Adrian", email_address="adrian@openunited.com", id=uuid.uuid4(), slug="1")
        user2 = User.objects.create(id=uuid.uuid4(),username="farbod")
        bee_keeper2 = Person.objects.create(user=user2,first_name="Farbod", email_address="farbod@openunited.com", id=uuid.uuid4(), slug="2")
       
        contributor_account1 = ContributorAccount.objects.create(owner=bee_keeper1,community_status=CommunityStatusOptions.BEE_KEEPER,nonliquid_points_balance=10000)
        contributor_account2 = ContributorAccount.objects.create(owner=bee_keeper2,community_status=CommunityStatusOptions.BEE_KEEPER,nonliquid_points_balance=10000)
       
        today = datetime.datetime.utcnow().date()
        sometime_ago = today - datetime.timedelta(days=35)
        tomorrow = today + datetime.timedelta(days=1)

        #old conversion rates
        PointPriceConfiguration.objects.create(
            applicable_from_date=sometime_ago,
            usd_point_inbound_price_in_cents = 4500,
            eur_point_inbound_price_in_cents = 4000,
            gbp_point_inbound_price_in_cents = 3500,
            usd_point_outbound_price_in_cents = 3000,
            eur_point_outbound_price_in_cents = 2500,
            gbp_point_outbound_price_in_cents = 2000,
        )

        #current conversion rates that should be in effect from today
        PointPriceConfiguration.objects.create(
            applicable_from_date=today,
            usd_point_inbound_price_in_cents = 4095,
            eur_point_inbound_price_in_cents = 3500,
            gbp_point_inbound_price_in_cents = 3005,
            usd_point_outbound_price_in_cents = 3480,
            eur_point_outbound_price_in_cents = 2975,
            gbp_point_outbound_price_in_cents = 2554,
        )

        #new conversion rates, that are coming tomorrow
        PointPriceConfiguration.objects.create(
            applicable_from_date=tomorrow,
            usd_point_inbound_price_in_cents = 4000,
            eur_point_inbound_price_in_cents = 3000,
            gbp_point_inbound_price_in_cents = 2800,
            usd_point_outbound_price_in_cents = 3500,
            eur_point_outbound_price_in_cents = 2850,
            gbp_point_outbound_price_in_cents = 2290,
        )



    def test_granting_points_from_grant_updates_organisation_account_balance(self):
        org = Organisation.objects.get(username="testco")
        self.assertEqual(org.name, "Test Co")
        org_account = OrganisationAccount.objects.get(organisation=org)
        self.assertEqual(org_account.nonliquid_points_balance, 0)

        bee_keeper1 = Person.objects.get(first_name="Adrian")
        bee_keeper2 = Person.objects.get(first_name="Farbod")

        #check that each bee keeper has the right status
        self.assertEqual(bee_keeper1.get_community_status(), CommunityStatusOptions.BEE_KEEPER)
        self.assertEqual(bee_keeper2.get_community_status(), CommunityStatusOptions.BEE_KEEPER)

        #create grant and credit organisation
        grant = Grant.objects.create(
                organisation_account = org_account,
                nominating_bee_keeper = bee_keeper1,
                approving_bee_keeper = bee_keeper2,
                description = "test grant",
                number_of_points = 500
        )
        org_account.credit(granting_object = grant)

        #test that balance is correct
        self.assertEqual(org_account.nonliquid_points_balance, grant.number_of_points)


    def test_full_payment_of_sales_order_credits_org_account(self):
        #TODO: handle sales tax with logic related to org account
        org = Organisation.objects.get(username="testco")
        self.assertEqual(org.name, "Test Co")
        org_account = OrganisationAccount.objects.get(organisation=org)
        self.assertEqual(org_account.liquid_points_balance, 0)

        person = Person.objects.get(first_name="Adrian")

        self.assertEqual(PointPriceConfiguration.get_point_inbound_price_in_cents(CurrencyTypes.EUR), 3500)

        expected_total_price_in_cents = 3500 * 500

        cart = Cart.new(org_account, person, 500, CurrencyTypes.EUR, PaymentTypes.ONLINE)

        self.assertEqual(cart.total_payable_in_cents, expected_total_price_in_cents)
        self.assertEqual(cart.currency_of_payment, CurrencyTypes.EUR)

        sales_order = SalesOrder.create_from_cart(cart)

        sales_order.register_payment(CurrencyTypes.EUR, (3500 * 500), "test transaction")

        self.assertTrue(sales_order.is_paid_in_full())
        self.assertEqual(sales_order.payment_status, PaymentStatusOptions.PAID)

        self.assertEqual(org_account.liquid_points_balance, 500)






 


    #def test_completed_task_claim_updates_contributor_and_product_accounts(self):

    #def test_allocating_points_from_org_to_product_results_in_correct_balances(self):

    #def test_reserved_points_not_available_for_allocation_to_tasks(self):

    #def test_reserved_points_converted_to_debit_after_successful_task_completion(self):
        
    #def test_correct_contributor_balance_and_transactions_after_cashing_in_liquid_points(self):

    #def test_completing_tasks_updates_contributor_status(self):
