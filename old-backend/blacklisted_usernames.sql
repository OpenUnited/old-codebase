ALTER TABLE public.users_user OWNER TO openunited;

ALTER TABLE public.black_listed_usernames OWNER TO openunited;

ALTER TABLE public.capability OWNER TO openunited;

ALTER TABLE public.comments_capabilitycomment OWNER TO openunited;

ALTER TABLE public.comments_ideacomment OWNER TO openunited;

ALTER TABLE public.comments_taskcomment OWNER TO openunited;

ALTER TABLE public.comments_ideacomment OWNER TO openunited;

ALTER TABLE public.commercial_organisation OWNER TO openunited;

ALTER TABLE public.commercial_productowner OWNER TO openunited;

ALTER TABLE public.django_session OWNER TO openunited;

ALTER TABLE public.ideas_bugs_idea OWNER TO openunited;

ALTER TABLE public.ideas_bugs_ideavote OWNER TO openunited;

ALTER TABLE public.license_contributor_agreement OWNER TO openunited;

ALTER TABLE public.license_contributor_agreement_acceptance OWNER TO openunited;

ALTER TABLE public.license_contributorguide OWNER TO openunited;

ALTER TABLE public.license_license OWNER TO openunited;

ALTER TABLE public.matching_taskclaim OWNER TO openunited;

ALTER TABLE public.notifications_notification OWNER TO openunited;

ALTER TABLE public.pages_page OWNER TO openunited;

ALTER TABLE public.talent_person OWNER TO openunited;

ALTER TABLE public.talent_personprofile OWNER TO openunited;

ALTER TABLE public.talent_productperson OWNER TO openunited;

ALTER TABLE public.talent_review OWNER TO openunited;

ALTER TABLE public.talent_socialaccount OWNER TO openunited;

ALTER TABLE public.work_attachment OWNER TO openunited;

ALTER TABLE public.work_createproductrequest OWNER TO openunited;

ALTER TABLE public.work_initiative OWNER TO openunited;

ALTER TABLE public.work_product OWNER TO openunited;

ALTER TABLE public.work_product_attachment OWNER TO openunited;

ALTER TABLE public.work_producttask OWNER TO openunited;

ALTER TABLE public.work_tag OWNER TO openunited;

ALTER TABLE public.work_task OWNER TO openunited;

ALTER TABLE public.work_task_attachment OWNER TO openunited;

ALTER TABLE public.work_task_depend OWNER TO openunited;

ALTER TABLE public.work_task_tag OWNER TO openunited;

ALTER TABLE public.work_tasklisting OWNER TO openunited;

INSERT INTO public.black_listed_usernames(username)
VALUES ('account'),
       ('admin'),
       ('api'),
       ('blog'),
       ('cache'),
       ('changelog'),
       ('enterprise'),
       ('gist'),
       ('graphql'),
       ('help'),
       ('jobs'),
       ('lists'),
       ('login'),
       ('logout'),
       ('mine'),
       ('news'),
       ('plans'),
       ('popular'),
       ('projects'),
       ('products'),
       ('about'),
       ('pages'),
       ('privacy'),
       ('privacy-policy'),
       ('terms-of-use'),
       ('security'),
       ('shop'),
       ('translations'),
       ('signup'),
       ('status'),
       ('styleguide'),
       ('tour'),
       ('wiki'),
       ('stories'),
       ('organizations'),
       ('codereview'),
       ('better'),
       ('compare'),
       ('hosting'),
       ('site'),
       ('content'),
       ('cms'),
       ('style'),
       ('setup'),
       ('console'),
       ('user');