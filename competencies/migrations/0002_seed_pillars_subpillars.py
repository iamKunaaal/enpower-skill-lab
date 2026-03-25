from django.db import migrations


PILLARS = [
    {'id': 1, 'name': 'Self Exploration',       'number': '01', 'color': 'teal',   'order': 1},
    {'id': 2, 'name': 'Foundational Literacy',  'number': '02', 'color': 'purple', 'order': 2},
    {'id': 3, 'name': 'Tech of the Future',     'number': '03', 'color': 'blue',   'order': 3},
    {'id': 4, 'name': 'Human Skills',           'number': '04', 'color': 'orange', 'order': 4},
    {'id': 5, 'name': 'Future Competencies',    'number': '05', 'color': 'green',  'order': 5},
]

SUB_PILLARS = [
    # Self Exploration
    {'sp_number': 1,  'pillar_id': 1, 'name': 'Self-discovery, Interest & Values'},
    {'sp_number': 2,  'pillar_id': 1, 'name': 'Personality Development & Communication'},
    {'sp_number': 3,  'pillar_id': 1, 'name': 'Connecting to the World'},
    # Foundational Literacy
    {'sp_number': 4,  'pillar_id': 2, 'name': 'Digital, Media & Data Literacy'},
    {'sp_number': 5,  'pillar_id': 2, 'name': 'Financial & Economic Literacy'},
    {'sp_number': 6,  'pillar_id': 2, 'name': 'Environmental & Sustainability Literacy'},
    # Tech of the Future
    {'sp_number': 7,  'pillar_id': 3, 'name': 'Smart Systems, IoT'},
    {'sp_number': 8,  'pillar_id': 3, 'name': 'AI, Coding, ML, Robotics'},
    {'sp_number': 9,  'pillar_id': 3, 'name': 'Design, Emerging Tech'},
    # Human Skills
    {'sp_number': 10, 'pillar_id': 4, 'name': 'Critical Thinking & Problem Solving'},
    {'sp_number': 11, 'pillar_id': 4, 'name': 'Creativity & Innovation'},
    {'sp_number': 12, 'pillar_id': 4, 'name': 'Collaboration'},
    {'sp_number': 13, 'pillar_id': 4, 'name': 'Emotional Intelligence (SEL)'},
    # Future Competencies
    {'sp_number': 14, 'pillar_id': 5, 'name': 'Design Thinking'},
    {'sp_number': 15, 'pillar_id': 5, 'name': 'Entrepreneurial Mindset'},
    {'sp_number': 16, 'pillar_id': 5, 'name': 'Global Citizenship & Cross-cultural Awareness'},
    {'sp_number': 17, 'pillar_id': 5, 'name': 'Readiness for Future of Work'},
]


def seed_data(apps, schema_editor):
    Pillar    = apps.get_model('competencies', 'Pillar')
    SubPillar = apps.get_model('competencies', 'SubPillar')

    for p in PILLARS:
        Pillar.objects.get_or_create(id=p['id'], defaults={
            'name': p['name'], 'number': p['number'],
            'color': p['color'], 'order': p['order'],
        })

    for sp in SUB_PILLARS:
        SubPillar.objects.get_or_create(sp_number=sp['sp_number'], defaults={
            'pillar_id': sp['pillar_id'], 'name': sp['name'],
        })


def unseed_data(apps, schema_editor):
    apps.get_model('competencies', 'SubPillar').objects.all().delete()
    apps.get_model('competencies', 'Pillar').objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('competencies', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_data, unseed_data),
    ]
