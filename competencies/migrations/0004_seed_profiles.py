from django.db import migrations

PROFILES = [
    (1,  'Tech Innovator'),
    (2,  'Strategic Thinker'),
    (3,  'Social Leader'),
    (4,  'Financial Steward'),
    (5,  'Well-Being Navigator'),
    (6,  'Creative Maker'),
    (7,  'Critical Analyst'),
    (8,  'Global Communicator'),
    (9,  'Environmental Champion'),
    (10, 'Entrepreneurial Mind'),
    (11, 'Research Scholar'),
    (12, 'Digital Navigator'),
    (13, 'Community Builder'),
    (14, 'Design Thinker'),
    (15, 'Collaborative Leader'),
]


def seed(apps, schema_editor):
    Profile = apps.get_model('competencies', 'Profile')
    for number, name in PROFILES:
        Profile.objects.get_or_create(number=number, defaults={'name': name})


def unseed(apps, schema_editor):
    apps.get_model('competencies', 'Profile').objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('competencies', '0003_profile_model'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
